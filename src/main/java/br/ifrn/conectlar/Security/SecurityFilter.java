package br.ifrn.conectlar.Security;

import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import br.ifrn.conectlar.Service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            var token = this.recoverToken(request);
            if (token != null) {
                String login = tokenService.validarToken(token);
                Long id = tokenService.obterId(token);
                String roleString = tokenService.obterRole(token);

                if (login != null && id != null && roleString != null) {
                    UsuarioRole role = UsuarioRole.valueOf(roleString);
                    List<GrantedAuthority> authorities = buildAuthorities(role);

                    UsuarioDetails userDetails = new UsuarioDetails(login, authorities, id, roleString);
                    var authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            // Log silencioso para não parar a requisição em rotas públicas
            System.out.println("Filtro de segurança ignorou token inválido/nulo: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }

    private List<GrantedAuthority> buildAuthorities(UsuarioRole role) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        switch (role) {
            case ADM -> {
                authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                authorities.add(new SimpleGrantedAuthority("ROLE_USUARIO"));
                authorities.add(new SimpleGrantedAuthority("ROLE_PROFISSIONAL"));
            }
            case PROFISSIONAL -> {
                authorities.add(new SimpleGrantedAuthority("ROLE_PROFISSIONAL"));
                authorities.add(new SimpleGrantedAuthority("ROLE_USUARIO"));
            }
            case USUARIO -> authorities.add(new SimpleGrantedAuthority("ROLE_USUARIO"));
        }

        return authorities;
    }
}