package br.ifrn.conectlar.Model.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class AvaliacaoDTO {
    private int nota;
    private String comentario;
    private LocalDateTime dataAvaliacao;
    private TrabalhoDTO trabalho;
}
