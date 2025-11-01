package br.ifrn.conectlar.Model.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(schema = "usuario", name= "profissional" )
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProfissionalEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, unique = true, length = 100)
    private String login;

    @Column(nullable = false)
    private String senha;

    @Column(length = 150, nullable = false )
    private String localizacao;

    @Column(length = 150)
    private String telefone;

    @Column(length = 150)
    private String funcao;
}
