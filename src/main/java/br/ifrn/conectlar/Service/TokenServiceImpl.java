package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Entity.BaseAuthEntity;
import br.ifrn.conectlar.Model.Entity.BaseUsuarioEntity;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service

public class TokenServiceImpl implements TokenService {

   @Value("${api.security.token.secret}")
   private String secret;


    @Override
    public String gerarToken(BaseAuthEntity usuario) {
        try {
            Algorithm algoritimo = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("auth-api")
                    .withSubject(usuario.getEmail())
                    .withClaim("role", usuario.getRole().name())
                    .withExpiresAt(gerarDataExpiracao())
                    .sign(algoritimo);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar Token");
        }
    }

    @Override
    public String validarToken(String token) {
        try {
            Algorithm algoritimo = Algorithm.HMAC256(secret);
            return JWT.require(algoritimo)
                    .withIssuer("conectlar-api")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e) {
            return null;
        }
    }

    private Instant gerarDataExpiracao() {
        return LocalDateTime.now()
                .plusHours(2)
                .toInstant(ZoneOffset.of("-03:00"));
    }
}
