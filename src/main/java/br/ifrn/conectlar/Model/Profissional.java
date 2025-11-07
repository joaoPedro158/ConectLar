package br.ifrn.conectlar.Model;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.flywaydb.core.internal.util.StringUtils;

@Getter
@SuperBuilder
public class Profissional extends Usuario {
    private String funcao;


    protected Profissional(Long id, String nome, String login, String email, String senha, String telefone, String localizacao, String funcao) {
        super(id, nome, login, email, senha, telefone, localizacao);

        this.funcao = funcao;

        validateInternalState();

    }
    @Override
    protected void validateInternalState() {

        super.validateInternalState();


        if (!StringUtils.hasText(this.funcao)) {
            throw new IllegalArgumentException("A função do profissional não pode ser nula ou vazia.");
        }

    }
}
