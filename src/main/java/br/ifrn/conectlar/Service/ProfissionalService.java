package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Profissional;
import br.ifrn.conectlar.Model.dto.ProfissionalDTO;
import br.ifrn.conectlar.Model.dto.ProfissionalRecord;

import java.util.List;

public interface ProfissionalService {

   ProfissionalDTO saveProfissional(ProfissionalRecord profissionalRecord);

   List<ProfissionalDTO> getAll();
}
