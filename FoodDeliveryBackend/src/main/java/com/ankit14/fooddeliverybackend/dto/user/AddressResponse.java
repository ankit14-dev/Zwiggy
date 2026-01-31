package com.ankit14.fooddeliverybackend.dto.user;

import com.ankit14.fooddeliverybackend.model.AddressType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for address response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {

    private Long id;
    private String street;
    private String city;
    private String state;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private AddressType type;
    private Boolean isDefault;
}
