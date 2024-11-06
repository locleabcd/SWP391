package com.swpproject.koi_care_system.service.supplier;

import com.swpproject.koi_care_system.exceptions.AlreadyExistsException;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.models.Supplier;
import com.swpproject.koi_care_system.payload.request.AddSupplierRequest;
import com.swpproject.koi_care_system.payload.request.SupplierUpdateRequest;
import com.swpproject.koi_care_system.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SupplierService implements ISupplierService {

    private final SupplierRepository supplierRepository;
    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Supplier not found!"));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public Supplier getSupplierByName(String name) {
        return supplierRepository.findByName(name);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public List<Supplier> getAllSupplier() {
        return supplierRepository.findAll();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public Supplier addSupplier(AddSupplierRequest addSupplierRequest) {
        if(supplierRepository.existsByName(addSupplierRequest.getName())){
            throw new AlreadyExistsException("The supplier with this name already exists");
        }
        Supplier supplier = new Supplier(
                null,
                addSupplierRequest.getName(),
                addSupplierRequest.getPhone(),
                addSupplierRequest.getAddress()
        );
        return supplierRepository.save(supplier);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public Supplier updateSupplier(SupplierUpdateRequest supplier, Long id) {
        return Optional.ofNullable(getSupplierById(id)).map(oldSupplier ->{
            oldSupplier.setName(supplier.getName());
            oldSupplier.setPhone(supplier.getPhone());
            oldSupplier.setAddress(supplier.getAddress());
            return supplierRepository.save(oldSupplier);
        }).orElseThrow(()-> new ResourceNotFoundException("Supplier not found!"));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public void deleteSupplierById(Long id) {
        supplierRepository.findById(id)
                .ifPresentOrElse(supplierRepository::delete,()->{
                    throw new ResourceNotFoundException("Supplier not found!");
                });
    }
}