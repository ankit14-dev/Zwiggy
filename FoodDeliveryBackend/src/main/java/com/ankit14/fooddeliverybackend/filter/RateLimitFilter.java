package com.ankit14.fooddeliverybackend.filter;

import com.ankit14.fooddeliverybackend.config.JwtUtil;
import com.ankit14.fooddeliverybackend.config.RateLimitConfig;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Rate limiting filter using token bucket algorithm.
 * Limits requests based on IP for unauthenticated users, or user ID for
 * authenticated users.
 */
@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitConfig rateLimitConfig;
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip rate limiting for static resources and swagger
        if (path.startsWith("/swagger") || path.startsWith("/v3/api-docs") ||
                path.startsWith("/webjars") || path.contains(".")) {
            filterChain.doFilter(request, response);
            return;
        }

        String key = resolveKey(request);
        int limit = resolveLimit(request, path);

        Bucket bucket = rateLimitConfig.resolveBucket(key + ":" + limit, limit);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        // Add rate limit headers
        response.addHeader("X-Rate-Limit-Limit", String.valueOf(limit));
        response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));

        if (probe.isConsumed()) {
            filterChain.doFilter(request, response);
        } else {
            long waitTimeSeconds = probe.getNanosToWaitForRefill() / 1_000_000_000;
            response.addHeader("X-Rate-Limit-Retry-After", String.valueOf(waitTimeSeconds));
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"success\":false,\"message\":\"Rate limit exceeded. Try again in "
                    + waitTimeSeconds + " seconds.\",\"data\":null}");
            log.warn("Rate limit exceeded for key: {}", key);
        }
    }

    private String resolveKey(HttpServletRequest request) {
        // Try to get user ID from JWT token
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            try {
                String token = bearerToken.substring(7);
                String email = jwtUtil.extractUsername(token);
                if (email != null) {
                    return "user:" + email;
                }
            } catch (Exception e) {
                // Fall through to IP-based limiting
            }
        }

        // Fall back to IP address
        String ip = request.getHeader("X-Forwarded-For");
        if (!StringUtils.hasText(ip)) {
            ip = request.getRemoteAddr();
        } else {
            ip = ip.split(",")[0].trim();
        }
        return "ip:" + ip;
    }

    private int resolveLimit(HttpServletRequest request, String path) {
        // Auth endpoints have stricter limits
        if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register")) {
            return RateLimitConfig.AUTH_REQUESTS_PER_MINUTE;
        }

        // Check if admin endpoint
        if (path.startsWith("/api/analytics") || path.startsWith("/api/admin")) {
            return RateLimitConfig.ADMIN_REQUESTS_PER_MINUTE;
        }

        // Check if authenticated
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return RateLimitConfig.AUTHENTICATED_REQUESTS_PER_MINUTE;
        }

        return RateLimitConfig.PUBLIC_REQUESTS_PER_MINUTE;
    }
}
