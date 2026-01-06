package br.ifrn.conectlar.Model.Entity;

import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;


import java.util.Collection;
import java.util.List;

@Entity
@Table(name= "usuario")
@Getter
@Setter
@AllArgsConstructor
public class UsuarioEntity extends BaseUsuarioEntity {



}
