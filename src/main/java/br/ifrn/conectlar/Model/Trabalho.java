package br.ifrn.conectlar.Model;

import br.ifrn.conectlar.Model.Enum.CategoriaEnum;
import br.ifrn.conectlar.Model.Enum.StatusTrabalho;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.access.AccessDeniedException;

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
    private CategoriaEnum categoria;


    protected Trabalho(Long id, Localizacao localizacao, String problema, BigDecimal pagamento, String descricao, LocalDateTime dataHoraAberta,StatusTrabalho status, Long idUsuario, Long idProfissional, CategoriaEnum categoria) {
        this.id = id;
        this.localizacao = localizacao;
        this.problema = problema;
        this.pagamento = pagamento;
        this.descricao = descricao;
        this.dataHoraAberta = dataHoraAberta;
        this.status = status;
        this.idUsuario = idUsuario;
        this.idProfissional = idProfissional;
        this.categoria = categoria;


        validacao();
    }

    public void validacao() {
        if (this.problema == null || this.problema.trim().length() < 5) {
            throw new IllegalArgumentException("O título do problema deve ter pelo menos 5 caracteres.");
        }
        if (this.descricao == null || this.descricao.trim().length() < 10) {
            throw new IllegalArgumentException("A descrição deve ser detalhada.");
        }
        if (this.pagamento == null || this.pagamento.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor do pagamento deve ser maior que zero.");
        }
    }

    public void concluir(Long idUsuarioSolicitante) {

        // Regra de Segurança/Propriedade
        if (!this.idUsuario.equals(idUsuarioSolicitante)) {
            throw new AccessDeniedException("Apenas o solicitante do serviço pode confirmar a conclusão.");
        }

        // Regras de Estado (Máquina de Estados)
        if (this.status == StatusTrabalho.ABERTO) {
            throw new IllegalStateException("Não é possível concluir um trabalho que ainda não tem profissional vinculado.");
        }
        if (this.status == StatusTrabalho.CANCELADO) {
            throw new IllegalStateException("Este trabalho foi cancelado e não pode ser concluído.");
        }
        if (this.status == StatusTrabalho.CONCLUIDO) {
            throw new IllegalStateException("O trabalho já foi marcado como concluído anteriormente.");
        }
        if (this.idProfissional == null) {
            throw new IllegalStateException("Erro inconsistente: Trabalho em andamento sem profissional vinculado.");
        }

        this.status = StatusTrabalho.CONCLUIDO;
    }
}

