package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import br.ifrn.conectlar.Model.dto.LocalizacaoDTO;
import br.ifrn.conectlar.Model.dto.Record.LocalizacaoRecord;

public interface LocalizacaoService {
    LocalizacaoDTO cadastralocalizacao(LocalizacaoRecord localizacao, UsuarioRole role, Long id);
}
