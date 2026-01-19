package br.ifrn.conectlar.Security;

import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

@Getter
public class UsuarioDetails extends User {

    private final Long id;
    private final UsuarioRole role;


    public UsuarioDetails(String email, Collection<? extends GrantedAuthority> authorities, Long id, String roleString) {
        super(email, "", authorities);
        this.id = id;
        this.role = UsuarioRole.valueOf(roleString);
    }
}