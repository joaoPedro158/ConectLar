package br.ifrn.conectlar.Model.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class TrabalhoDTO {

    private Long id;
    private LocalizacaoDTO localizacao;
    private String problema;
    private BigDecimal pagamento;
    private String descricao;
    private LocalDateTime dataHoraAberta;

    // Dados do Usuário
    private Long idUsuario;
    private String nomeUsuario;


}