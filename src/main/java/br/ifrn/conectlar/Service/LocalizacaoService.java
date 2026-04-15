package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import br.ifrn.conectlar.Model.dto.LocalizacaoDTO;
import br.ifrn.conectlar.Model.dto.Record.LocalizacaoRecord;

import java.util.List;

public interface LocalizacaoService {
    LocalizacaoDTO cadastralocalizacao(LocalizacaoRecord localizacao, UsuarioRole role, Long id);
    List<LocalizacaoDTO> listaLocalizacao(UsuarioRole role, Long id);
}
