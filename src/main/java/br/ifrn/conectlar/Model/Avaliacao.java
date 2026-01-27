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


    protected Avaliacao(Long id,Integer nota, String comentario, LocalDateTime dataAvaliacao, Trabalho trabalho) {
        this.id = id;
        this.nota = nota;
        this.comentario = comentario;
        this.dataAvaliacao = dataAvaliacao;
        this.trabalho = trabalho;

        validacao();
    }

    private void validacao() {
//        // Regra 1: Trabalho Obrigatório
//        if (this.trabalho == null) {
//            throw new IllegalArgumentException("A avaliação deve estar vinculada a um trabalho.");
//        }
//
//        // Regra 2: Status do Trabalho
//        if (this.trabalho.getStatus() != StatusTrabalho.CONCLUIDO) {
//            throw new IllegalArgumentException("Você só pode avaliar trabalhos que já foram finalizados.");
//        }
//
//        // Regra 3: Profissional Vinculado
//        // Regra B: Verificação simples pelo ID
//        if (trabalho.getIdProfissional() == null) {
//            throw new IllegalStateException("Erro: Este trabalho não tem um profissional vinculado.");
//        }
//
//        // Regra 4: Intervalo da Nota
//        if (this.nota == null || this.nota < 1 || this.nota > 5) {
//            throw new IllegalArgumentException("A nota deve ser um valor entre 1 e 5.");
//        }
    }
}

