package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.dto.KoiPondDto;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.models.KoiPond;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.payload.request.AddKoiPondRequest;
import com.swpproject.koi_care_system.payload.request.KoiPondUpdateRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.repository.UserRepository;
import com.swpproject.koi_care_system.service.koipond.IKoiPondService;
import com.swpproject.koi_care_system.service.user.IUserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.lang.module.ResolutionException;
import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("/koiponds")
public class KoiPondController {
    private final IKoiPondService koiPondService;
    private final UserRepository userRepository;
    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createKoiPond(@ModelAttribute AddKoiPondRequest addKoiPondRequest, Authentication authentication) {
        try{
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(()->new RuntimeException("User not found"));
            addKoiPondRequest.setUser(user);
            KoiPondDto koiPond = koiPondService.addKoiPond(addKoiPondRequest);
            return ResponseEntity.ok(new ApiResponse("Add Koi pond success!", koiPond));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }
    @GetMapping("/user/{userID}/koiponds")
    public ResponseEntity<ApiResponse> getAllKoiPondByUserID(@PathVariable Long userID) {
        try {
            List<KoiPondDto> koiPondDtos = koiPondService.getKoiPondByUserID(userID);
            return ResponseEntity.ok(new ApiResponse("Found!", koiPondDtos));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error", INTERNAL_SERVER_ERROR));
        }
    }
    @GetMapping("/koipond/{id}")
    public ResponseEntity<ApiResponse> getKoiPondByID(@PathVariable Long id){
        try{
            KoiPondDto koiPondDto = koiPondService.getKoiPondById(id);
            return ResponseEntity.ok(new ApiResponse("Found",koiPondDto));
        }catch(ResolutionException e){
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }
    @DeleteMapping("/koipond/{id}/delete")
    public ResponseEntity<ApiResponse> deleteKoiPond(@PathVariable Long id){
        try{
            koiPondService.deleteKoiPond(id);
            return ResponseEntity.ok(new ApiResponse("Delete success!",null));
        }catch(ResourceNotFoundException e){
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }
    @PutMapping("/koipond/{id}/update")
    public ResponseEntity<ApiResponse> updateKoiPond(@PathVariable Long id,@ModelAttribute KoiPondUpdateRequest koiPondUpdateRequest) {
        try {
            KoiPondDto koiPondDto = koiPondService.updateKoiPond(koiPondUpdateRequest, id);
            return ResponseEntity.ok(new ApiResponse("Update success!", koiPondDto));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
}