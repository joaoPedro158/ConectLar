package br.ifrn.conectlar.Model.dto;

import br.ifrn.conectlar.Model.Enum.CategoriaEnum;
import br.ifrn.conectlar.Model.Enum.StatusTrabalho;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter; // Adicione o Setter para facilitar

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
@Setter // Adicionado para permitir marcar como avaliado no Service
public class TrabalhoDTO {
    private Long id;
    private LocalizacaoDTO localizacao;
    private String problema;
    private BigDecimal pagamento;
    private String descricao;
    private LocalDateTime dataHoraAberta;
    private StatusTrabalho status;
    private CategoriaEnum categoria;
    private Long idUsuario;
    private String nomeUsuario;
    private Long idProfissional;
    private String nomeProfissional;
    private String caminhoImagem;
    private LocalDateTime dataHoraFinalizado;
    private boolean avaliado;
}