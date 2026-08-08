package br.com.foztalentos.api.dto.category;

import java.time.LocalDateTime;

// Dados de saída ao retornar uma categoria
public record CategoryResponseDTO(

        Long id,
        String name,
        Boolean active,
        LocalDateTime createdAt

) {}
