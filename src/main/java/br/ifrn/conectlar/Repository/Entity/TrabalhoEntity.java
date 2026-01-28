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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusTrabalho status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private CategoriaEnum categoria;

    //  (Chaves Estrangeiras) ---
    @ElementCollection
    @CollectionTable(
            name = "trabalho_imagem",                        // 1. Nome da tabela que criamos no SQL
            joinColumns = @JoinColumn(name = "id_trabalho")  // 2. Nome da coluna Foreign Key no SQL
    )
    @Column(name = "caminho_imagem")                     // 3. Nome da coluna de valor no SQL
    private List<String> imagens = new ArrayList<>();

    /*
     * @ManyToOne: "Muitos trabalhos podem ser de UM usuário"
     * @JoinColumn: Define qual coluna no banco guarda o ID do usuário.
     */
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private UsuarioEntity usuario;

    // VOCÊ PRECISA DISSO AQUI:
    @ManyToOne // Um profissional tem vários trabalhos
    @JoinColumn(name = "id_profissional") // Nome da coluna no banco
    private ProfissionalEntity profissional;


}