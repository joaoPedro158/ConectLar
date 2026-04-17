package br.ifrn.conectlar.Repository.Entity;

import br.ifrn.conectlar.Model.Enum.CategoriaEnum;
import br.ifrn.conectlar.Model.Interface.PerfilEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name= "profissional")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProfissionalEntity extends BaseUsuarioEntity implements PerfilEntity {
    @Enumerated(EnumType.STRING)
    @Column(length = 150)
    private CategoriaEnum categoria;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "profissional_localizacao",
            joinColumns        = @JoinColumn(name = "id_profissional"),
            inverseJoinColumns = @JoinColumn(name = "id_localizacao")
    )
    private List<LocalizacaoEntity> localizacao;

}
