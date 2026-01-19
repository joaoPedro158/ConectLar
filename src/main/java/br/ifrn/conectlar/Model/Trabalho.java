package br.ifrn.conectlar.Model;

import br.ifrn.conectlar.Model.Enum.StatusTrabalho;
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
    private StatusTrabalho status;
    private Long idUsuario;
    private Long idProfissional;


    protected Trabalho(Long id, Localizacao localizacao, String problema, BigDecimal pagamento, String descricao, LocalDateTime dataHoraAberta,StatusTrabalho status, Long idUsuario, Long idProfissional) {
        this.id = id;
        this.localizacao = localizacao;
        this.problema = problema;
        this.pagamento = pagamento;
        this.descricao = descricao;
        this.dataHoraAberta = dataHoraAberta;
        this.status = status;
        this.idUsuario = idUsuario;
        this.idProfissional = idProfissional;


        validacao();
    }

    public void validacao() {
        // --- 1. Validação de Conteúdo (Qualidade do Pedido) ---

        // Regra: O problema deve ser claro (mínimo de 5 caracteres)
        if (this.problema == null || this.problema.trim().length() < 5) {
            throw new IllegalArgumentException("O título do problema deve ter pelo menos 5 caracteres.");
        }

        // Regra: A descrição deve ser detalhada (mínimo de 10 caracteres)
        if (this.descricao == null || this.descricao.trim().length() < 10) {
            throw new IllegalArgumentException("A descrição deve ser detalhada (mínimo de 10 caracteres) para ajudar o profissional.");
        }

        // --- 2. Validação de Localização (Obrigatória) ---
        // Regra: Um trabalho físico NÃO pode existir sem endereço
        if (this.localizacao == null) {
            throw new IllegalArgumentException("A localização do trabalho é obrigatória.");
        }
        // Nota: Não precisamos validar rua/cep aqui, pois a própria classe Localizacao já se valida no construtor dela!

        // --- 3. Validação Financeira (Pagamento) ---

        if (this.pagamento == null) {
            throw new IllegalArgumentException("O valor do pagamento é obrigatório.");
        }

        // Regra: Não aceitamos pagamentos negativos ou zero
        if (this.pagamento.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor do pagamento deve ser maior que zero.");
        }


        // --- 4. Validação de Vínculo (Quem pediu?) ---

        if (this.idUsuario == null) {
            throw new IllegalArgumentException("Erro de Sistema: O trabalho deve estar vinculado a um usuário solicitante.");
        }

    }
}
