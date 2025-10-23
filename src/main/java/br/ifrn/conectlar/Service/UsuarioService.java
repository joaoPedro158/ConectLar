package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.dto.UsuarioDTO;
import br.ifrn.conectlar.Model.dto.UsuarioRecord;

public interface UsuarioService {

    UsuarioDTO saveUsuario(UsuarioRecord usuario);
}
