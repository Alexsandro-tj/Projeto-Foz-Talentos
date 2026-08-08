package br.com.foztalentos.api.repository;

import br.com.foztalentos.api.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Repositório de dados para a entidade Admin
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);
    boolean existsByEmail(String email);
}
