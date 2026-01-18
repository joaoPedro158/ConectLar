package br.ifrn.conectlar.Security;

import br.ifrn.conectlar.Model.Enum.UsuarioRole; // Verifique se o caminho do seu Enum está certo
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

@Getter
public class UsuarioDetails extends User {

    private final Long id;
    private final UsuarioRole role;

    // Construtor que vamos usar no Filter
    public UsuarioDetails(String email, Collection<? extends GrantedAuthority> authorities, Long id, String roleString) {
        // Manda o email e uma senha vazia para o Spring (pois já validamos o token)
        super(email, "", authorities);
        this.id = id;
        this.role = UsuarioRole.valueOf(roleString); // Converte a String "ADM" para o Enum
    }
}