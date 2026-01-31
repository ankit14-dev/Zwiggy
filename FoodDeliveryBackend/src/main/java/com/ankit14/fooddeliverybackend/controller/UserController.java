package com.ankit14.fooddeliverybackend.controller;

import com.ankit14.fooddeliverybackend.dto.common.ApiResponse;
import com.ankit14.fooddeliverybackend.dto.user.AddressRequest;
import com.ankit14.fooddeliverybackend.dto.user.AddressResponse;
import com.ankit14.fooddeliverybackend.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for user management endpoints.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management APIs")
public class UserController {

    private final AddressService addressService;

    @GetMapping("/addresses")
    @Operation(summary = "Get current user's addresses")
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getMyAddresses() {
        List<AddressResponse> response = addressService.getCurrentUserAddresses();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/addresses/{id}")
    @Operation(summary = "Get address by ID")
    public ResponseEntity<ApiResponse<AddressResponse>> getAddressById(@PathVariable Long id) {
        AddressResponse response = addressService.getAddressById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/addresses")
    @Operation(summary = "Add a new address")
    public ResponseEntity<ApiResponse<AddressResponse>> addAddress(@Valid @RequestBody AddressRequest request) {
        AddressResponse response = addressService.createAddress(request);
        return ResponseEntity.ok(ApiResponse.success("Address added", response));
    }

    @PutMapping("/addresses/{id}")
    @Operation(summary = "Update an address")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request) {
        AddressResponse response = addressService.updateAddress(id, request);
        return ResponseEntity.ok(ApiResponse.success("Address updated", response));
    }

    @DeleteMapping("/addresses/{id}")
    @Operation(summary = "Delete an address")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted", null));
    }
}
