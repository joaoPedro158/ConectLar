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

        if (this.problema == null || this.problema.trim().length() < 5) {
            throw new IllegalArgumentException("O título do problema deve ter pelo menos 5 caracteres.");
        }

        if (this.descricao == null || this.descricao.trim().length() < 10) {
            throw new IllegalArgumentException("A descrição deve ser detalhada (mínimo de 10 caracteres) para ajudar o profissional.");
        }

        if (this.localizacao == null) {
            throw new IllegalArgumentException("A localização do trabalho é obrigatória.");
        }

        if (this.pagamento == null) {
            throw new IllegalArgumentException("O valor do pagamento é obrigatório.");
        }

        if (this.pagamento.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor do pagamento deve ser maior que zero.");
        }


    }
}
