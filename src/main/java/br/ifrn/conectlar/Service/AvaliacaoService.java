package br.ifrn.conectlar.Service;


import br.ifrn.conectlar.Model.dto.AvaliacaoDTO;
import br.ifrn.conectlar.Model.dto.AvaliacaoRecord;

public interface AvaliacaoService {

    AvaliacaoDTO avaliar(AvaliacaoRecord avaliacaoRecord, Long idProfissional);
}
