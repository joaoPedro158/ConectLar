package br.ifrn.conectlar.Model.Entity;

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

    @Column(nullable = false, length = 100)
    private String localidade;

    @Column(nullable = false, length = 250)
    private String problema;

    // Mapeia para o TIMESTAMP do banco.
    // O nome da coluna no banco é "data_hora_aberta" (snake_case)
    @Column(name = "data_hora_aberta", nullable = false)
    private LocalDateTime dataHoraAberta;

    // Mapeia para DECIMAL(10, 2). BigDecimal é obrigatório para dinheiro.
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pagamento;

    @Column(nullable = false) // Tamanho padrão 255
    private String descricao;

    // --- RELACIONAMENTOS (Chaves Estrangeiras) ---

    /*
     * @ManyToOne: "Muitos trabalhos podem ser de UM usuário"
     * @JoinColumn: Define qual coluna no banco guarda o ID do usuário.
     */
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private UsuarioEntity usuario;




    // --- DICA DE OURO ---
    // Este método roda automaticamente antes de salvar no banco.
    // Garante que a data nunca seja nula, mesmo que o Java esqueça de setar.
    @PrePersist
    public void prePersist() {
        if (this.dataHoraAberta == null) {
            this.dataHoraAberta = LocalDateTime.now();
        }
    }
}