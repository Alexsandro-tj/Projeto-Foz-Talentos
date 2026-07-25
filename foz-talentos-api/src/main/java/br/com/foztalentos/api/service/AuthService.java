package br.com.foztalentos.api.service;

import br.com.foztalentos.api.dto.login.LoginRequestDTO;
import br.com.foztalentos.api.dto.login.LoginResponseDTO;
import br.com.foztalentos.api.entity.Admin;
import br.com.foztalentos.api.exception.BusinessException;
import br.com.foztalentos.api.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// Serviço responsável pelo fluxo de autenticação e geração de tokens
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // Valida credenciais do usuário e retorna token JWT com dados básicos
    public LoginResponseDTO login(LoginRequestDTO request){

        Admin admin = adminRepository.findByEmail(request.email()).orElseThrow(()
                -> new BusinessException("Invalid email or password."));

        // Compara a senha informada com o hash salvo no banco
        if(!passwordEncoder.matches(
                request.password(),
                admin.getPassword()
        )){
            throw new BusinessException("Invalid email or password.");
        }

        // Gera token assinado contendo email e permissões
        String token = jwtService.generateToken(admin);

        return new LoginResponseDTO(
                token,
                "Login successful",
                admin.getName(),
                admin.getRole().name(),
                admin.getEmail()
        );

    }

}