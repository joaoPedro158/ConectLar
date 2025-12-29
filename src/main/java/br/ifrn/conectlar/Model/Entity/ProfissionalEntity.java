package br.ifrn.conectlar.Model.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name= "profissional")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProfissionalEntity extends BaseUsuarioEntity {
    @Column(length = 150)
    private String categoria;


}
