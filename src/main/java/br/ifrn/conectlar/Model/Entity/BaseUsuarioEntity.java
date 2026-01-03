package br.ifrn.conectlar.Model.Entity;

import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import jakarta.persistence.*;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter

public abstract class BaseUsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(length = 150, nullable = false)
    private String localizacao;

    @Column(length = 150, nullable = false, unique = true)
    private String telefone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UsuarioRole role;
}
