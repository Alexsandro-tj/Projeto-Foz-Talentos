package br.com.foztalentos.api.service;

import br.com.foztalentos.api.entity.Admin;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

// Serviço responsável por criar, decodificar e validar tokens JWT
@Service
public class JwtService {

    // Chave secreta obtida do application.properties
    @Value("${jwt.secret}")
    private String secret;

    // Tempo de validade do token obtido do application.properties
    @Value("${jwt.expiration}")
    private Long expiration;

    // Converte a chave secreta textual em uma chave HMAC válida para o JJWT
    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // Gera um novo token JWT com subject (e-mail) e claim de papel (role)
    public String generateToken(Admin admin) {

        return Jwts.builder().subject(admin.getEmail()).claim("role", admin.getRole().name())
                .issuedAt(new Date()).expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKey()).compact();

    }

    // Extrai o e-mail do usuário contido no payload do token
    public String extractEmail(String token) {

        Claims claims = Jwts.parser().verifyWith(getKey())
                .build().parseSignedClaims(token).getPayload();

        return claims.getSubject();

    }

    // Verifica se o token pertence ao admin informado e se não está expirado
    public boolean isTokenValid(String token, Admin admin) {

        Claims claims = Jwts.parser().verifyWith(getKey())
                .build().parseSignedClaims(token).getPayload();

        return claims.getSubject().equals(admin.getEmail())
                && claims.getExpiration().after(new Date());

    }

}