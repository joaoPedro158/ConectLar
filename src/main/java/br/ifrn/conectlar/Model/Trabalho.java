package br.ifrn.conectlar.Model;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class Trabalho {
    private Long id;
    private Localizacao localizacao;
    private String problema;
    private BigDecimal pagamento;
    private String descricao;
    private LocalDateTime dataHoraAberta;
    private Long idUsuario;


    protected Trabalho(Long id, Localizacao localizacao, String problema, BigDecimal pagamento, String descricao, LocalDateTime dataHoraAberta, Long idUsuario) {
        this.id = id;
        this.localizacao = localizacao;
        this.problema = problema;
        this.pagamento = pagamento;
        this.descricao = descricao;
        this.dataHoraAberta = dataHoraAberta;
        this.idUsuario = idUsuario;


        validacao();
    }

    public void validacao() {
        // --- 1. Validação de Strings (Não Nulo e Não Vazio) ---

        if (this.problema == null || this.problema.isBlank()) {
            throw new IllegalArgumentException("O problema do trabalho não pode ser nulo ou vazio.");
        }

        if (this.descricao == null || this.descricao.isBlank()) {
            throw new IllegalArgumentException("A descrição do trabalho não pode ser nula ou vazia.");
        }

        // --- 2. Validação Financeira (Pagamento) ---

        if (this.pagamento == null) {
            throw new IllegalArgumentException("O valor do pagamento é obrigatório.");
        }

        // Verifica se o pagamento é maior que zero (pagamento.compareTo(Zero) > 0)
        if (this.pagamento.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor do pagamento deve ser maior que zero.");
        }

        // --- 3. Validação de Relacionamentos (IDs Obrigatórios) ---
        // Um trabalho não pode existir sem um cliente e um profissional

        if (this.idUsuario == null) {
            throw new IllegalArgumentException("O ID do usuário solicitante é obrigatório.");
        }



    }
}
