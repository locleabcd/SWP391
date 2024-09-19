package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.dto.KoiFishDto;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.models.KoiFish;
import com.swpproject.koi_care_system.models.KoiPond;
import com.swpproject.koi_care_system.payload.request.AddKoiFishRequest;
import com.swpproject.koi_care_system.payload.request.KoiFishUpdateRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.koifish.IKoiFishService;
import com.swpproject.koi_care_system.service.koipond.IKoiPondService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@Controller
@RequestMapping("/koifishs")
public class KoiFishController {
    private final IKoiFishService koiFishService;
    @Autowired
    private IKoiPondService koiPondService;

    @PostMapping("/koipond/{id}/create")
    public ResponseEntity<ApiResponse> createKoiFish(@RequestBody AddKoiFishRequest koiFishRequest, @PathVariable Long id){
        try{
            KoiPond koiPond = koiPondService.getKoiPondById(id);
            koiFishRequest.setKoiPond(koiPond);
            KoiFish koiFish = koiFishService.addKoiFish(koiFishRequest);
            KoiFishDto koiFishDto = koiFishService.convertToDto(koiFish);
            return ResponseEntity.ok(new ApiResponse("Add Koi success!",koiFishDto));

        }catch(Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));

        }
    }
    @GetMapping("/koipond/{id}/allKoi")
    public ResponseEntity<ApiResponse> getAllKoiFishByKoiPondId(@PathVariable Long id){
        try{
            List<KoiFish> koiFishList = koiFishService.getKoiFishByKoiPond(id);
            List<KoiFishDto> koiFishDtos = koiFishService.getConvertedKoiPonds(koiFishList);
            return ResponseEntity.ok(new ApiResponse("Found!",koiFishDtos));
        }catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error",INTERNAL_SERVER_ERROR));
        }
    }

    @GetMapping("/user/{id}/allKoi")
    public ResponseEntity<ApiResponse> getAllKoiFishByUserId(@PathVariable Long id){
        try{
            List<KoiFish> koiFishList = koiFishService.getAllFishByUserId(id);
            List<KoiFishDto> koiFishDtos = koiFishService.getConvertedKoiPonds(koiFishList);
            return ResponseEntity.ok(new ApiResponse("Found!",koiFishDtos));
        }catch(Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error",INTERNAL_SERVER_ERROR));

        }
    }
    @DeleteMapping("/koifish/{id}/delete")
    public ResponseEntity<ApiResponse> deleteKoiFish(@PathVariable Long id){
        try{
            koiFishService.deleteKoiFish(id);
            return ResponseEntity.ok(new ApiResponse("Delete success!",null));
        }catch (ResourceNotFoundException e){
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }
    @PutMapping("/koifish/{id}/update")
    public ResponseEntity<ApiResponse> updateKoiFish(@PathVariable Long id, @RequestBody KoiFishUpdateRequest koiFishUpdateRequest){
        try{
           KoiFish updatedKoiFish = koiFishService.updateKoiFish(koiFishUpdateRequest,id);
           KoiFishDto koiFishDto = koiFishService.convertToDto(updatedKoiFish);
           return ResponseEntity.ok(new ApiResponse("Update success!",koiFishDto));
        }catch(ResourceNotFoundException e){
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }


    
}
