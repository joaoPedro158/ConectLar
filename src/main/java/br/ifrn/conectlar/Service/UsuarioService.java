package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.dto.UsuarioDTO;
import br.ifrn.conectlar.Model.dto.UsuarioRecord;

import java.util.List;

public interface UsuarioService {

    UsuarioDTO saveUsuario(UsuarioRecord usuario);

    List<UsuarioDTO> getAll();
}
