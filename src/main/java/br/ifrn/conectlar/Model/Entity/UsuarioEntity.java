package br.ifrn.conectlar.Model.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(schema = "usuario", name= "cliente" )
@Getter
@Setter
@AllArgsConstructor
public class UsuarioEntity extends BaseUsuarioEntity {


}
