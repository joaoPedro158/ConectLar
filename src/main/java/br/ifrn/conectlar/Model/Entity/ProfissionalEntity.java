package br.ifrn.conectlar.Model.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(schema = "usuario", name= "profissional" )
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProfissionalEntity extends BaseUsuarioEntity {
    @Column(length = 150)
    private String funcao;


}
