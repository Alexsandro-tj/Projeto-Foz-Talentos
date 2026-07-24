package br.com.foztalentos.api.controller;

import br.com.foztalentos.api.constant.ApiRoutes;
import br.com.foztalentos.api.dto.category.CategoryRequestDTO;
import br.com.foztalentos.api.dto.category.CategoryResponseDTO;
import br.com.foztalentos.api.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping(ApiRoutes.CATEGORIES)
@RequiredArgsConstructor
@PreAuthorize("hasRole('MASTER')")
@Tag(name = "Categorias")
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "Listar todas as categorias")
    @GetMapping
    public ResponseEntity<Page<CategoryResponseDTO>> findAll(Pageable pageable) {

        Page<CategoryResponseDTO> categories = categoryService.findAll(pageable);

        return ResponseEntity.ok(categories);

    }

    @Operation(summary = "Buscar categorias por ID")
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> findById( @PathVariable Long id) {
        return ResponseEntity.ok(categoryService.findById(id));
    }

    @Operation(summary = "Criar Categoria")
    @PostMapping
    public ResponseEntity<CategoryResponseDTO> create(@Valid @RequestBody CategoryRequestDTO request) {

        CategoryResponseDTO savedCategory = categoryService.create(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    @Operation(summary = "Atualizar categorias")
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequestDTO request) {

        CategoryResponseDTO updatedCategory = categoryService.update(id, request);

        return ResponseEntity.ok(updatedCategory);
    }

    @Operation(summary = "Desativar categorias")
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        categoryService.deactivate(id);
        return ResponseEntity.noContent().build();
    }




}
