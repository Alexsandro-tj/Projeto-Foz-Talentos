package br.com.foztalentos.api.config;

import br.com.foztalentos.api.entity.Admin;
import br.com.foztalentos.api.enums.Role;
import br.com.foztalentos.api.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (!adminRepository.existsByEmail("admin@gmail.com")) {
            Admin admin = new Admin();
            admin.setName("Administrador");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("admin@123"));
            admin.setRole(Role.MASTER);
            admin.setActive(true);

            adminRepository.save(admin);

        }

    }

}