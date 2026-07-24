package br.com.foztalentos.api.service;

import br.com.foztalentos.api.dto.admin.AdminRequestDTO;
import br.com.foztalentos.api.dto.admin.AdminResponseDTO;
import br.com.foztalentos.api.entity.Admin;
import br.com.foztalentos.api.exception.BusinessException;
import br.com.foztalentos.api.exception.ResourceNotFoundException;
import br.com.foztalentos.api.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminResponseDTO create(AdminRequestDTO request) {

        Admin admin = new Admin();


        admin.setName(request.name());
        admin.setEmail(request.email());
        admin.setRole(request.role());
        admin.setActive(true);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());
        admin.setPassword(passwordEncoder.encode(request.password()));

        if(adminRepository.existsByEmail(admin.getEmail())) {
            throw new BusinessException("Email Already registered");
        }

        Admin savedAdmin = adminRepository.save(admin);

        return toResponseDTO(savedAdmin);
    }

    public Page<AdminResponseDTO> findAll(Pageable pageable) {

        return adminRepository.findAll(pageable).map(this::toResponseDTO);

    }

    public AdminResponseDTO findById(Long id) {

        Admin admin = adminRepository.findById(id).orElseThrow(()
                -> new ResourceNotFoundException("Admin not found."));

        return toResponseDTO(admin);

    }

    public AdminResponseDTO update(Long id, AdminRequestDTO request) {

        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found."));

        Admin existing = adminRepository.findByEmail(request.email())
                .orElse(null);

        if(existing != null && !existing.getId().equals(id)){
            throw new BusinessException("Email already registered.");
        }
        admin.setName(request.name());
        admin.setEmail(request.email());
        admin.setUpdatedAt(LocalDateTime.now());

        if (request.password() != null && !request.password().isBlank()) {
            admin.setPassword(passwordEncoder.encode(request.password()));
        }

        Admin updatedAdmin = adminRepository.save(admin);

        return toResponseDTO(updatedAdmin);

    }

    public void deactivate(Long id) {

        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found."));

        admin.setActive(false);
        admin.setUpdatedAt(LocalDateTime.now());

        adminRepository.save(admin);

    }

    private AdminResponseDTO toResponseDTO(Admin admin) {

        return new AdminResponseDTO(
                admin.getId(),
                admin.getName(),
                admin.getEmail(),
                admin.getRole(),
                admin.getActive(),
                admin.getCreatedAt(),
                admin.getUpdatedAt()
        );

    }

}