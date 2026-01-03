package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Entity.UsuarioEntity;

public interface TokenService {

    String gerarToken(UsuarioEntity usuario);

    String validarToken(String token);
}
