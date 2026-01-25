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
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        var token = recuperarToken(request);

        if (token != null) {
            var email = tokenService.validarToken(token);

            if (email != null) {
                String roleDoToken = tokenService.obterRole(token);
                Long id = tokenService.obterId(token);

                var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + roleDoToken));

                UsuarioDetails principal = new UsuarioDetails(email, authorities, id, roleDoToken);

                var authentication = new UsernamePasswordAuthenticationToken(principal, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;

        if (!authHeader.startsWith("Bearer ")) return null;
        return authHeader.substring(7).trim();
    }
}
