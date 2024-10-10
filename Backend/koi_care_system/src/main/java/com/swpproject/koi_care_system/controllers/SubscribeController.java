package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.payload.request.UpgradePremiumRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.subscribe.ISubscribePlanService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@Slf4j
@RestController
@RequestMapping("/subscribe")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubscribeController {
    private final ISubscribePlanService subscribePlanService;
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllCustomer(){
        try{
            return ResponseEntity.ok(new ApiResponse("Found",subscribePlanService.getAllCustomer()));
        }catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }
    @PutMapping("/upgrade")
    public ResponseEntity<ApiResponse> upgradePremium(@RequestBody @Valid UpgradePremiumRequest request){
        try{
            return ResponseEntity.ok(new ApiResponse("Upgrade success",subscribePlanService.upgradePremium(request)));
        }catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }
}
