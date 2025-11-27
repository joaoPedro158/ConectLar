package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.dto.AdmDTO;
import br.ifrn.conectlar.Model.dto.AdmRecord;

import java.util.List;

public interface AdmService {
    AdmDTO save(AdmRecord record);
    List<AdmDTO> getAll();
    AdmDTO findById(Long id);
    AdmDTO update(Long id, AdmRecord record);
    void delete(Long id);
}
