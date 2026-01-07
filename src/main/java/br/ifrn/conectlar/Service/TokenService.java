package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Entity.BaseAuthEntity;
import br.ifrn.conectlar.Model.Entity.BaseUsuarioEntity;


public interface TokenService {

    String gerarToken(BaseAuthEntity usuario);

    String validarToken(String token);
}
