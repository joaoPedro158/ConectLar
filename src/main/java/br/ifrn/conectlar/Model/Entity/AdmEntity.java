package br.ifrn.conectlar.Model.Entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "adm")
@Getter
@Setter
@AllArgsConstructor
@Builder
public class AdmEntity extends BaseAuthEntity {


}