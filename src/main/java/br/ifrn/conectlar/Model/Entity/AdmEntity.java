package br.ifrn.conectlar.Model.Entity;

import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "adm")
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


    @Column(name = "senha_adm", nullable = false)
    private String senhaAdm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UsuarioRole role;
}