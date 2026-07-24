package br.com.foztalentos.api.dto.login;

public record LoginResponseDTO(

        String token,
        String message,
        String name,
        String type,
        String email
) {}
