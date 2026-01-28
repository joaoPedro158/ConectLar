package br.ifrn.conectlar.Model.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class DadosProfissionalDTO {
    private Double mediaAvaliacao;
    private BigDecimal lucroTotal;
    private int pedidosConcluido;
    private int pedidosAndamento;
}
