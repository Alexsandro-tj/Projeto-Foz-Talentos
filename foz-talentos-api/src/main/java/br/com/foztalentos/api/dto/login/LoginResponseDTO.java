package br.com.foztalentos.api.dto.login;

// Dados retornados após autenticação bem-sucedida
public record LoginResponseDTO(

        String token,
        String message,
        String name,
        String type,
        String email
) {}
