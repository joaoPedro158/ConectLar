package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Entity.BaseUsuarioEntity;


public interface TokenService {

    String gerarToken(BaseUsuarioEntity usuario);

    String validarToken(String token);
}
