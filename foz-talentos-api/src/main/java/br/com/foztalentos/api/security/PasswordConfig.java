package br.com.foztalentos.api.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

// Configuração para criptografia de senhas
@Configuration
public class PasswordConfig {

    // Define o algoritmo de hash BCrypt para ser injetado onde for necessário
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
