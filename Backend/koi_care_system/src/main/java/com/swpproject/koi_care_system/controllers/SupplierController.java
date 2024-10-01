package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.models.Supplier;
import com.swpproject.koi_care_system.payload.request.AddSupplierRequest;
import com.swpproject.koi_care_system.payload.request.SupplierUpdateRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.supplier.ISupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("/suppliers")
public class SupplierController {
    private final ISupplierService supplierService;
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllSupplier(){
        try{
            List<Supplier> supplierList = supplierService.getAllSupplier();
            return ResponseEntity.ok(new ApiResponse("Found!",supplierList));
        }catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error",null));
        }
    }
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addSupplier(@RequestBody AddSupplierRequest addSupplierRequest){
        try{
            Supplier theSupplier = supplierService.addSupplier(addSupplierRequest);
            return ResponseEntity.ok(new ApiResponse("Added success!",theSupplier));
        }catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error",null));
        }
    }
    @GetMapping("/supplier/{id}/by_id")
    public ResponseEntity<ApiResponse> getSupplierById(@PathVariable Long id){
        try {
            Supplier supplier = supplierService.getSupplierById(id);
            return  ResponseEntity.ok(new ApiResponse("Found", supplier));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
    @GetMapping("/supplier/{name}/by_name")
    public ResponseEntity<ApiResponse> getSupplierByName(@PathVariable String name){
        try {
            Supplier supplier = supplierService.getSupplierByName(name);
            return  ResponseEntity.ok(new ApiResponse("Found", supplier));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
    @DeleteMapping("/supplier/{id}/delete")
    public ResponseEntity<ApiResponse> deleteSupplier(@PathVariable Long id){
        try {
            supplierService.deleteSupplierById(id);
            return  ResponseEntity.ok(new ApiResponse("Found",null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
    @PutMapping("/supplier/{id}/update")
    public ResponseEntity<ApiResponse> updateSupplier(@PathVariable Long id, @RequestBody SupplierUpdateRequest supplierUpdateRequest){
        try {
            Supplier updatedSupplier = supplierService.updateSupplier(supplierUpdateRequest,id);
            return ResponseEntity.ok(new ApiResponse("Update success!", updatedSupplier));
        }catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

}