package br.ifrn.conectlar.Repository.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "avaliacao")
public class AvaliacaoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer nota;

    @Column(length = 255)
    private String comentario;

    @Column(name = "data_avaliacao", nullable = false)
    private LocalDateTime dataAvaliacao;

    // RELACIONAMENTO 1:1
    // optional = false significa que é obrigatório ter um trabalho (NOT NULL no banco)
    @OneToOne(optional = false)
    @JoinColumn(name = "id_trabalho", unique = true, nullable = false)
    private TrabalhoEntity trabalho;
}
