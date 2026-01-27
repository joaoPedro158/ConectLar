package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.dto.ProfissionalDTO;
import br.ifrn.conectlar.Model.dto.ProfissionalRecord;
import br.ifrn.conectlar.Model.dto.TrabalhoDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProfissionalService {

   ProfissionalDTO saveProfissional(ProfissionalRecord profissionalRecord, MultipartFile arquivo);

   List<ProfissionalDTO> getAll();
   void deleteProfissional(long id);
   ProfissionalDTO updateProfissional(Long id, ProfissionalRecord profissionalRecord,  MultipartFile arquivo);
   List<TrabalhoDTO> historico(Long id);
   ProfissionalDTO getProfissional(Long id);
}
