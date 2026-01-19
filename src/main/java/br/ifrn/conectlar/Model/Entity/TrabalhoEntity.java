package br.ifrn.conectlar.Model.Entity;

import br.ifrn.conectlar.Model.Enum.StatusTrabalho;
import br.ifrn.conectlar.Model.Localizacao;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    //  (Chaves Estrangeiras) ---

    /*
     * @ManyToOne: "Muitos trabalhos podem ser de UM usuário"
     * @JoinColumn: Define qual coluna no banco guarda o ID do usuário.
     */
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private UsuarioEntity usuario;


}