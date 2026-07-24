package br.com.foztalentos.api.service;

import br.com.foztalentos.api.dto.category.CategoryRequestDTO;
import br.com.foztalentos.api.dto.category.CategoryResponseDTO;
import br.com.foztalentos.api.entity.Category;
import br.com.foztalentos.api.exception.BusinessException;
import br.com.foztalentos.api.exception.ResourceNotFoundException;
import br.com.foztalentos.api.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;


    public CategoryResponseDTO create(CategoryRequestDTO request) {

        Category category = new Category();

        category.setActive(true);
        category.setCreatedAt(LocalDateTime.now());
        category.setName(request.name());

        if (categoryRepository.existsByNameIgnoreCase(request.name())) {
            throw new BusinessException("Category already exists");
        }


        Category savedCategory = categoryRepository.save(category);

        return toResponseDTO(savedCategory);

    }

    public Page<CategoryResponseDTO> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable).map(this::toResponseDTO);
    }

    public CategoryResponseDTO findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found."));

        return toResponseDTO(category);
    }

    public CategoryResponseDTO update(Long id, CategoryRequestDTO request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found."));

        Category existing = categoryRepository
                .findByNameIgnoreCase(request.name())
                .orElse(null);

        if (existing != null && !existing.getId().equals(id)) {
            throw new BusinessException("Category already exists.");
        }

        category.setName(request.name());

        Category updatedCategory = categoryRepository.save(category);

        return toResponseDTO(updatedCategory);
    }

    public void deactivate(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found."));

        category.setActive(false);

        categoryRepository.save(category);
    }
    private CategoryResponseDTO toResponseDTO(Category category) {

        return new CategoryResponseDTO(
                category.getId(),
                category.getName(),
                category.getActive(),
                category.getCreatedAt()
        );
    }
    

}
