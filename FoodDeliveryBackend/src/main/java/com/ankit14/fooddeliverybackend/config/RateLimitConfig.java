package com.ankit14.fooddeliverybackend.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.context.annotation.Configuration;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * Rate limiting configuration using Bucket4j token bucket algorithm.
 */
@Configuration
public class RateLimitConfig {

    // Rate limit settings
    public static final int PUBLIC_REQUESTS_PER_MINUTE = 100;
    public static final int AUTH_REQUESTS_PER_MINUTE = 10;
    public static final int AUTHENTICATED_REQUESTS_PER_MINUTE = 60;
    public static final int ADMIN_REQUESTS_PER_MINUTE = 120;

    // Cache to store buckets per IP/user
    private final Cache<String, Bucket> bucketCache = Caffeine.newBuilder()
            .expireAfterAccess(10, TimeUnit.MINUTES)
            .maximumSize(100_000)
            .build();

    /**
     * Get or create a rate limit bucket for the given key and limit.
     */
    public Bucket resolveBucket(String key, int requestsPerMinute) {
        return bucketCache.get(key, k -> createBucket(requestsPerMinute));
    }

    private Bucket createBucket(int requestsPerMinute) {
        Bandwidth limit = Bandwidth.simple(requestsPerMinute, Duration.ofMinutes(1));
        return Bucket.builder().addLimit(limit).build();
    }

    /**
     * Clear all buckets (useful for testing).
     */
    public void clearCache() {
        bucketCache.invalidateAll();
    }
}
