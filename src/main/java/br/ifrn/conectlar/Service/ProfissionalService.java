package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.dto.ProfissionalDTO;
import br.ifrn.conectlar.Model.dto.ProfissionalRecord;
import br.ifrn.conectlar.Model.dto.TrabalhoDTO;

import java.util.List;

public interface ProfissionalService {

   ProfissionalDTO saveProfissional(ProfissionalRecord profissionalRecord);

   List<ProfissionalDTO> getAll();
   void deleteProfissional(long id);
   ProfissionalDTO updateProfissional(long id, ProfissionalRecord profissionalRecord);
   List<TrabalhoDTO> historico(Long id);
}
