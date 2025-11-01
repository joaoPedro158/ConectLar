package br.ifrn.conectlar.Model;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.flywaydb.core.internal.util.StringUtils;

@Getter
@SuperBuilder
public class Profissional extends Usuario {
    private String especialidade;
    private String funcao;


    protected Profissional(Long id, String nome, String login, String email, String senha, String telefone, String localizacao, String especialidade, String funcao) {
        super(id, nome, login, email, senha, telefone, localizacao);

        this.especialidade = especialidade;
        this.funcao = funcao;

        validateInternalState();

    }
    @Override
    protected void validateInternalState() {
        // 8. PRIMEIRO: Executa todas as validações do "pai" (Usuario)
        super.validateInternalState();

        // 9. DEPOIS: Adiciona as novas validações específicas do Profissional
        if (!StringUtils.hasText(this.funcao)) {
            throw new IllegalArgumentException("A função do profissional não pode ser nula ou vazia.");
        }

        if (!StringUtils.hasText(this.especialidade)) {
            throw new IllegalArgumentException("A especialidade do profissional não pode ser nula ou vazia.");
        }
    }
}
