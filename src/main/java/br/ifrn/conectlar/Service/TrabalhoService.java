package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.dto.TrabalhoDTO;
import br.ifrn.conectlar.Model.dto.TrabalhoRecord;

import java.util.List;

public interface TrabalhoService {

    List<TrabalhoDTO> getAll();
    TrabalhoDTO findById(Long id);
    TrabalhoDTO save(TrabalhoRecord record);
    TrabalhoDTO update(Long id, TrabalhoRecord trabalho);
    void delete(Long id);

    List<TrabalhoDTO> ListaHistorico(Long id);
}
