package br.ifrn.conectlar.Model;

import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.flywaydb.core.internal.util.StringUtils;

@Getter
@SuperBuilder
public class Profissional extends Usuario {
    private String categoria;


    protected Profissional(Long id, String nome, String email, String senha, String telefone, Localizacao localizacao, String categoria, UsuarioRole role) {
        super(id, nome, email, senha, telefone, localizacao,role);

        this.categoria = categoria;

        validacao();

    }
    @Override
    public void validacao() {

        super.validacao();


        if (!StringUtils.hasText(this.categoria)) {
            throw new IllegalArgumentException("A categoria do profissional não pode ser nula ou vazia.");
        }

    }
}
