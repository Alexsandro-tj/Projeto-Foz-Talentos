package br.com.foztalentos.api.dto.category;

import jakarta.validation.constraints.NotBlank;

// Dados de entrada para cadastro/atualização de categoria
public record CategoryRequestDTO(
        @NotBlank
        String name

) {
}
