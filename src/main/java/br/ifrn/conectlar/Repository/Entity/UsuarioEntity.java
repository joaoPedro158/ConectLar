package br.ifrn.conectlar.Repository.Entity;


import br.ifrn.conectlar.Model.Interface.PerfilEntity;
import br.ifrn.conectlar.Model.Localizacao;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name= "usuario")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioEntity extends BaseUsuarioEntity implements PerfilEntity {

    @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinTable(
            name = "usuario_localizacao",
            joinColumns        = @JoinColumn(name = "id_usuario"),
            inverseJoinColumns = @JoinColumn(name = "id_localizacao")
    )
    private List<LocalizacaoEntity> localizacao =  new ArrayList<>();

}
