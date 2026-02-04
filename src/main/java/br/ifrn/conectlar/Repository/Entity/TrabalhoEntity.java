package br.ifrn.conectlar.Repository.Entity;

import br.ifrn.conectlar.Model.Enum.CategoriaEnum;
import br.ifrn.conectlar.Model.Enum.StatusTrabalho;
import br.ifrn.conectlar.Model.Localizacao;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trabalho")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TrabalhoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    private Localizacao localizacao;

    @Column(nullable = false, length = 250)
    private String problema;

    @Column(name = "data_hora_aberta", nullable = false)
    private LocalDateTime dataHoraAberta;


    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pagamento;

    @Column(nullable = false)
    private String descricao;

    private String data_hora_finalizada;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusTrabalho status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private CategoriaEnum categoria;

    @Column(name = "caminho_imagem")
    private String caminhoImagem;


    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private UsuarioEntity usuario;


    @ManyToOne
    @JoinColumn(name = "id_profissional")
    private ProfissionalEntity profissional;

    @OneToOne(mappedBy = "trabalho")
    private AvaliacaoEntity avaliacao;


}