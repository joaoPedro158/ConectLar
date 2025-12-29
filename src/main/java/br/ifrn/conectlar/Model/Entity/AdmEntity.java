package br.ifrn.conectlar.Model.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "adm") // Nome da tabela no banco (definido no V1__...sql)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdmEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    /*
     * No DTO você colocou "email_adm", mas no Java (Entity)
     * a convenção correta é "emailAdm".
     * O @Column faz a ligação com o banco "email_adm".
     */
    @Column(name = "email_adm", nullable = false, unique = true)
    private String emailAdm;

    /*
     * No seu script SQL V1, a coluna se chama "senha".
     * Aqui na Entity, deve refletir o banco ("senha").
     * O Mapper cuidará de converter DTO.senha_adm -> Entity.senha
     */
    @Column(name = "senha_adm", nullable = false)
    private String senhaAdm;


}