package br.ifrn.conectlar.Model;

import br.ifrn.conectlar.Model.Enum.StatusTrabalho;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Builder
@Getter
public class Avaliacao {
    private Long id;
    private Integer nota;
    private String comentario;
    private LocalDateTime dataAvaliacao;
    private Trabalho trabalho;

    public Avaliacao(Long id, Integer nota, String comentario, LocalDateTime dataAvaliacao, Trabalho trabalho) {
        this.id = id;
        this.nota = nota;
        this.comentario = comentario;
        this.dataAvaliacao = (dataAvaliacao == null) ? LocalDateTime.now() : dataAvaliacao;
        this.trabalho = trabalho;
        validacao();
    }

    private void validacao() {
        if (this.trabalho == null) {
            throw new IllegalArgumentException("A avaliação deve estar vinculada a um trabalho.");
        }
        if (this.trabalho.getStatus() != StatusTrabalho.CONCLUIDO) {
            throw new IllegalArgumentException("Trabalho com status: " + trabalho.getStatus() + ". Apenas trabalhos CONCLUIDO podem ser avaliados.");
        }
        if (this.trabalho.getIdProfissional() == null) {
            throw new IllegalStateException("O trabalho deve possuir um profissional vinculado para ser avaliado.");
        }
        if (this.nota == null || this.nota < 1 || this.nota > 5) {
            throw new IllegalArgumentException("A nota deve ser entre 1 e 5.");
        }
    }
}