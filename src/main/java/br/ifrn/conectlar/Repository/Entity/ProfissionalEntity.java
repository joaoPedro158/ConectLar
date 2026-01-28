package br.ifrn.conectlar.Repository.Entity;

import br.ifrn.conectlar.Model.Enum.CategoriaEnum;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name= "profissional")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProfissionalEntity extends BaseUsuarioEntity {
    @Enumerated(EnumType.STRING)
    @Column(length = 150)
    private CategoriaEnum categoria;

}
