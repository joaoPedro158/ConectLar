package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Repository.Entity.BaseAuthEntity;


public interface TokenService {

    String gerarToken(BaseAuthEntity usuario);

    String validarToken(String token);
    String obterRole(String token);
    Long obterId(String token);
}
