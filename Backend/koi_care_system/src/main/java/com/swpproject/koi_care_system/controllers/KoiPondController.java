package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.dto.KoiPondDto;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.models.KoiPond;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.payload.request.AddKoiPondRequest;
import com.swpproject.koi_care_system.payload.request.KoiPondUpdateRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.koipond.IKoiPondService;
import com.swpproject.koi_care_system.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.lang.module.ResolutionException;
import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@Controller
@RequestMapping("/koiponds")
public class KoiPondController {
    private final IKoiPondService koiPondService;
    @Autowired
    private IUserService userService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createKoiPond(@RequestBody AddKoiPondRequest koiPondRequest, Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);
            koiPondRequest.setUser(user);
            KoiPond koiPond = koiPondService.addKoiPond(koiPondRequest);
            KoiPondDto koiPondDto = koiPondService.convertToDto(koiPond);
            return ResponseEntity.ok(new ApiResponse("Add Koi pond success!", koiPondDto));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/user/{userID}/koiponds")
    public ResponseEntity<ApiResponse> getAllKoiPondByUserID(@PathVariable Long userID){
        try{
            List<KoiPond> koiPonds=koiPondService.getKoiPondByUserID(userID);
            List<KoiPondDto> koiPondDtos = koiPondService.getConvertedKoiPonds(koiPonds);
            return ResponseEntity.ok(new ApiResponse("Found!",koiPondDtos));
        }catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error",INTERNAL_SERVER_ERROR));
        }
    }
    @GetMapping("/koipond/{id}")
    public ResponseEntity<ApiResponse> getKoiPondByID(@PathVariable Long id){
        try{
            KoiPond theKoiPond = koiPondService.getKoiPondById(id);
            KoiPondDto koiPondDto = koiPondService.convertToDto(theKoiPond);
            return ResponseEntity.ok(new ApiResponse("Found",koiPondDto));
        }catch(ResolutionException e){
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }
    @DeleteMapping("/koipond/{id}/delete")
    public ResponseEntity<ApiResponse> deleteKoiPond(@PathVariable Long id){
        try{
            koiPondService.deleteKoiPond(id);
            return ResponseEntity.ok(new ApiResponse("Found",null));
        }catch(ResourceNotFoundException e){
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }
    @PutMapping("/koipond/{id}/update")
    public ResponseEntity<ApiResponse> updateKoiPond(@PathVariable Long id,@RequestBody KoiPondUpdateRequest koiPond) {
        try {
            KoiPond updatedKoiPond = koiPondService.updateKoiPond(koiPond, id);
            KoiPondDto koiPondDto = koiPondService.convertToDto(updatedKoiPond);
            return ResponseEntity.ok(new ApiResponse("Update success!", koiPondDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
}
