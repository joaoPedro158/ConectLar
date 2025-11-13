package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Entity.ProfissionalEntity;
import br.ifrn.conectlar.Model.Profissional;
import br.ifrn.conectlar.Model.dto.ProfissionalDTO;
import br.ifrn.conectlar.Model.dto.ProfissionalRecord;
import br.ifrn.conectlar.Model.mapper.ProfissionalMapper;
import br.ifrn.conectlar.Repository.ProfissionalJpaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ProfissionalServiceImpl implements ProfissionalService {

    private final ProfissionalJpaRepository profissionalRepository;
    private final ProfissionalMapper mapper;

    @Override
    public ProfissionalDTO saveProfissional(ProfissionalRecord profissionalRecord) {
        Profissional profissionalModel = mapper.toModel(profissionalRecord);

        if (profissionalRepository.existsByLogin(profissionalModel.getLogin())) {
            throw new IllegalArgumentException("Este login já está em uso por outro profissional.");
        }
        if (profissionalRepository.existsByEmail(profissionalModel.getEmail())) {
            throw new IllegalArgumentException("Este e-mail já está em uso por outro profissional.");
        }
        if (profissionalRepository.existsByTelefone(profissionalModel.getTelefone())) {
            throw new IllegalArgumentException("Este telefone já está em uso por outro profissional.");
        }

        ProfissionalEntity entityToSave = mapper.toEntity(profissionalModel);
        ProfissionalEntity savedEntity = profissionalRepository.save(entityToSave);
        return mapper.toDTO(savedEntity);
    }

    @Override
    public List<ProfissionalDTO> getAll(){
        List<ProfissionalEntity> entidades = profissionalRepository.findAll();
        return entidades.stream().map(mapper::toDTO).toList();
    }

}
