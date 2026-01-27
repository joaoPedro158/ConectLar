package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.dto.TrabalhoDTO;
import br.ifrn.conectlar.Model.dto.UsuarioDTO;
import br.ifrn.conectlar.Model.dto.UsuarioRecord;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface UsuarioService {

    UsuarioDTO saveUsuario(UsuarioRecord usuario, MultipartFile fotoPerfil);

    List<UsuarioDTO> getAll();

    void deleteUsuario(Long id);

    UsuarioDTO updateUsuario(Long id, UsuarioRecord usuario, MultipartFile fotoPerfil);
    List<TrabalhoDTO> historico(Long id);
    BigDecimal getGastoTotal(Long id);
    UsuarioDTO getUsuario(Long id);
}
