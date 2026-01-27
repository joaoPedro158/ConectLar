package br.ifrn.conectlar.Model;

import br.ifrn.conectlar.Model.Enum.CategoriaEnum;
import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.flywaydb.core.internal.util.StringUtils;

@Getter
@SuperBuilder
public class Profissional extends Usuario {
    private CategoriaEnum categoria;


    protected Profissional(Long id, String nome, String email, String senha, String telefone, Localizacao localizacao, CategoriaEnum categoria, UsuarioRole role) {
        super(id, nome, email, senha, telefone, localizacao,role);

        this.categoria = categoria;

        validacao();

    }
    @Override
    public void validacao() {

        super.validacao();




    }
}
