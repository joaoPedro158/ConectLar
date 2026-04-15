package br.ifrn.conectlar.Repository.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "localizacao")
@Data
public class LocalizacaoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String rua;

    @Column(nullable = false, length = 100)
    private String bairro;

    @Column(nullable = false, length = 20)
    private String numero;

    @Column(nullable = false)
    private String cidade;

    @Column(nullable = false, length = 20)
    private String cep;

    @Column(nullable = false, length = 50)
    private String estado;

    private String complemento;
}
