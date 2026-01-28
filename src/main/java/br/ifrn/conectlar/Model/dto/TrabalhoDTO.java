package br.ifrn.conectlar.Model.dto;

import br.ifrn.conectlar.Model.Enum.CategoriaEnum;
import br.ifrn.conectlar.Model.Enum.StatusTrabalho;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class TrabalhoDTO {

    private Long id;
    private LocalizacaoDTO localizacao;
    private String problema;
    private BigDecimal pagamento;
    private String descricao;
    private LocalDateTime dataHoraAberta;
    private StatusTrabalho  status;
    private CategoriaEnum categoria;

    // Dados do Usuário
    private Long idUsuario;
    private String nomeUsuario;

    //dados do profissional

    private  Long idProfissional;
    private String nomeProfissional;

    //imnagem de trabalho
    private List<String> imagens;

    private LocalDateTime dataHoraFinalizado;

}