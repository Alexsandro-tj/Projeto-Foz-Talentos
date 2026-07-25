package br.com.foztalentos.api.dto.login;

// Credenciais utilizadas para autenticação do administrador
public record LoginRequestDTO(
    String email,
    String password
) {}
