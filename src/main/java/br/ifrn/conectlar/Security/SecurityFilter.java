package br.ifrn.conectlar.Security;

import br.ifrn.conectlar.Service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var token = recuperarToken(request);

        if (token != null) {
            // Se o token for inválido, validarToken retorna null e não entra no if
            var email = tokenService.validarToken(token);

            if (email != null) {
                // 1. Pega a role direto do token
                String roleDoToken = tokenService.obterRole(token);
                // 2. Cria a autoridade com o prefixo ROLE_
                var authorities = Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + roleDoToken)
                );

                // 3. Cria o usuário do Spring Security em memória
                User principal = new User(email, "", authorities);

                // 4. Autentica
                var authentication = new UsernamePasswordAuthenticationToken(principal, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        // O filterChain deve ser chamado APENAS UMA VEZ no final
        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}