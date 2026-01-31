package com.ankit14.fooddeliverybackend.service;

import com.ankit14.fooddeliverybackend.dto.user.AddressRequest;
import com.ankit14.fooddeliverybackend.dto.user.AddressResponse;
import com.ankit14.fooddeliverybackend.exception.ResourceNotFoundException;
import com.ankit14.fooddeliverybackend.model.Address;
import com.ankit14.fooddeliverybackend.model.AddressType;
import com.ankit14.fooddeliverybackend.model.User;
import com.ankit14.fooddeliverybackend.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for user address operations.
 */
@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;

    @Transactional(readOnly = true)
    public List<AddressResponse> getCurrentUserAddresses() {
        User user = getCurrentUser();
        return addressRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AddressResponse getAddressById(Long id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", id));
        return mapToResponse(address);
    }

    @Transactional
    public AddressResponse createAddress(AddressRequest request) {
        User user = getCurrentUser();

        // If this is set as default, unset other defaults
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.findByUserId(user.getId()).forEach(addr -> {
                if (addr.getIsDefault()) {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                }
            });
        }

        Address address = Address.builder()
                .street(request.getStreet())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .type(request.getType() != null ? request.getType() : AddressType.HOME)
                .isDefault(request.getIsDefault() != null ? request.getIsDefault() : false)
                .user(user)
                .build();

        address = addressRepository.save(address);
        return mapToResponse(address);
    }

    @Transactional
    public AddressResponse updateAddress(Long id, AddressRequest request) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", id));

        User user = getCurrentUser();

        // Handle default flag
        if (Boolean.TRUE.equals(request.getIsDefault()) && !address.getIsDefault()) {
            addressRepository.findByUserId(user.getId()).forEach(addr -> {
                if (addr.getIsDefault() && !addr.getId().equals(id)) {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                }
            });
        }

        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setLatitude(request.getLatitude());
        address.setLongitude(request.getLongitude());
        if (request.getType() != null)
            address.setType(request.getType());
        if (request.getIsDefault() != null)
            address.setIsDefault(request.getIsDefault());

        address = addressRepository.save(address);
        return mapToResponse(address);
    }

    @Transactional
    public void deleteAddress(Long id) {
        if (!addressRepository.existsById(id)) {
            throw new ResourceNotFoundException("Address", "id", id);
        }
        addressRepository.deleteById(id);
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private AddressResponse mapToResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .latitude(address.getLatitude())
                .longitude(address.getLongitude())
                .type(address.getType())
                .isDefault(address.getIsDefault())
                .build();
    }
}
