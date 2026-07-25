package br.com.foztalentos.api.exception;

// Exceção para buscas que não encontram o registro no banco (ex: ID inexistente)
public class ResourceNotFoundException extends RuntimeException{

    public ResourceNotFoundException(String message) {
        super(message);
    }

}
