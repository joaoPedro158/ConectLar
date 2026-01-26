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
        if (this.categoria == null) {
            throw new IllegalArgumentException("A categoria do profissional é obrigatória.");
        }


        if (this.getRole() != UsuarioRole.PROFISSIONAL) {
            throw new IllegalArgumentException("Erro de consistência: Um objeto 'Profissional' deve possuir exclusivamente a role 'PROFISSIONAL'.");
        }



    }
}
