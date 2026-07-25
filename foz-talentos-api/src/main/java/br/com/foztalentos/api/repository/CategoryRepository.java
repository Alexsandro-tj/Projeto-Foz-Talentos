package br.com.foztalentos.api.repository;

import br.com.foztalentos.api.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Repositório de dados para a entidade Category
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);

}
