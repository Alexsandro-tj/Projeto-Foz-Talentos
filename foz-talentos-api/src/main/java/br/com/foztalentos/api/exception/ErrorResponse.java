package br.com.foztalentos.api.exception;

import java.time.LocalDateTime;

// DTO padronizado para retorno de mensagens de erro da API
public record ErrorResponse (

    LocalDateTime timestamp,
    Integer Status,
    String message,
    String path

    )
{}
