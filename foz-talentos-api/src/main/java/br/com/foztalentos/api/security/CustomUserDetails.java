package br.com.foztalentos.api.security;

import br.com.foztalentos.api.entity.Admin;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

// Wrapper da entidade Admin para compatibilidade com o Spring Security
@Getter
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final Admin admin;

    // Converte o Role do Admin para a autoridade do Spring Security (ex: ROLE_MASTER)
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String roleName = "ROLE_" + admin.getRole().name();
        return List.of(new SimpleGrantedAuthority(roleName));
    }

    // Retorna a senha criptografada
    @Override
    public String getPassword() {
        return admin.getPassword();
    }

    // Retorna o e-mail como nome de usuário principal
    @Override
    public String getUsername() {
        return admin.getEmail();
    }

    // Indica se a conta está dentro do prazo de validade
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // Controla o bloqueio de conta através da flag 'active' do admin
    @Override
    public boolean isAccountNonLocked() {
        return admin.getActive();
    }

    // Indica se as credenciais estão válidas/não expiradas
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // Ativa/desativa a conta com base no status do admin no banco
    @Override
    public boolean isEnabled() {
        return admin.getActive();
    }

}