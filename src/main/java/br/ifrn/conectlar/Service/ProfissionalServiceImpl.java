package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Entity.ProfissionalEntity;
import br.ifrn.conectlar.Model.Entity.TrabalhoEntity;
import br.ifrn.conectlar.Model.Profissional;
import br.ifrn.conectlar.Model.dto.ProfissionalDTO;
import br.ifrn.conectlar.Model.dto.ProfissionalRecord;
import br.ifrn.conectlar.Model.dto.TrabalhoDTO;
import br.ifrn.conectlar.Model.mapper.ProfissionalMapper;
import br.ifrn.conectlar.Model.mapper.TrabalhoMapper;
import br.ifrn.conectlar.Repository.ProfissionalJpaRepository;
import br.ifrn.conectlar.Repository.TrabalhoJpaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@AllArgsConstructor
public class ProfissionalServiceImpl implements ProfissionalService {

    private final ProfissionalJpaRepository profissionalRepository;
    private final ProfissionalMapper mapper;
    private final TrabalhoJpaRepository trabalhoRepository;
    private final TrabalhoMapper trabalhoMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public ProfissionalDTO saveProfissional(ProfissionalRecord profissionalRecord) {
        Profissional profissionalModel = mapper.toModel(profissionalRecord);

        if (profissionalRepository.existsByEmail(profissionalModel.getEmail())) {
            throw new IllegalArgumentException("Este e-mail já está em uso por outro profissional.");
        }
        if (profissionalRepository.existsByTelefone(profissionalModel.getTelefone())) {
            throw new IllegalArgumentException("Este telefone já está em uso por outro profissional.");
        }

        ProfissionalEntity entityToSave = mapper.toEntity(profissionalModel);
        String senhaCriptografada = passwordEncoder.encode(profissionalModel.getSenha());
        entityToSave.setSenha(senhaCriptografada);

        ProfissionalEntity savedEntity = profissionalRepository.save(entityToSave);
        return mapper.toDTO(savedEntity);
    }

    @Override
    public List<ProfissionalDTO> getAll(){
        List<ProfissionalEntity> entidades = profissionalRepository.findAll();
        return entidades.stream().map(mapper::toDTO).toList();
    }

    @Override
    public void deleteProfissional(long id) {
        if (!profissionalRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado com ID: " + id);
        }
        profissionalRepository.deleteById(id);
    }


    @Override
    public ProfissionalDTO updateProfissional(Long id, ProfissionalRecord profissionalRecord) {
        Profissional profissionalModel = mapper.toModel(profissionalRecord);

        ProfissionalEntity entityToUpdate = profissionalRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("o profissional não encontrado com o ID: " + id ));

        if (profissionalRepository.findByEmailAndIdNot(profissionalModel.getEmail(), id).isPresent()) {
            throw new IllegalArgumentException("Este e-mail ja esta em uso por outro profissional.");
        }
        if (profissionalRepository.findByTelefoneAndIdNot(profissionalModel.getTelefone(), id).isPresent()) {
            throw new IllegalArgumentException("Este telefone ja esta em uso por outro profissional.");
        }
        mapper.updateEntityFromModel(profissionalModel, entityToUpdate);
        ProfissionalEntity updateEntity = profissionalRepository.save(entityToUpdate);

        return mapper.toDTO(updateEntity);
    }

    @Override
    public List<TrabalhoDTO> historico(Long id) {
        List<TrabalhoEntity> historico = trabalhoRepository.findByProfissionalIdOrderByDataHoraAbertaDesc(id);
        return historico.stream().map(trabalhoMapper::toDTO).toList();
    }

}
