package br.com.foztalentos.api.exception;

// Exceção customizada para erros de regras de negócio (ex: e-mail já cadastrado, operação não permitida)
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
