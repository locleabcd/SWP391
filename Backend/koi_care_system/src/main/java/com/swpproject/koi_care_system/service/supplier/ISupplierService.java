package com.swpproject.koi_care_system.service.supplier;

import com.swpproject.koi_care_system.models.Supplier;
import com.swpproject.koi_care_system.payload.request.AddSupplierRequest;
import com.swpproject.koi_care_system.payload.request.SupplierUpdateRequest;

import java.util.List;

public interface ISupplierService {
    Supplier getSupplierById(Long id);
    Supplier getSupplierByName(String name);
    List<Supplier> getAllSupplier();
    Supplier addSupplier(AddSupplierRequest supplier);
    Supplier updateSupplier(SupplierUpdateRequest supplier, Long id);
    void deleteSupplierById(Long id);

}