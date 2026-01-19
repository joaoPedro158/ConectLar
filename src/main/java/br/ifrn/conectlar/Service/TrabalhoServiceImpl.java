package br.ifrn.conectlar.Service;


import br.ifrn.conectlar.Model.Entity.TrabalhoEntity;
import br.ifrn.conectlar.Model.Entity.UsuarioEntity;
import br.ifrn.conectlar.Model.Enum.StatusTrabalho;
import br.ifrn.conectlar.Model.Trabalho;
import br.ifrn.conectlar.Model.dto.TrabalhoDTO;
import br.ifrn.conectlar.Model.dto.TrabalhoRecord;
import br.ifrn.conectlar.Model.mapper.TrabalhoMapper;
import br.ifrn.conectlar.Repository.TrabalhoJpaRepository;
import br.ifrn.conectlar.Repository.UsuarioJpaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class TrabalhoServiceImpl implements TrabalhoService {

    private final TrabalhoJpaRepository trabalhoRepository;
    private final TrabalhoMapper mapper;

    private final UsuarioJpaRepository usuarioRepository;


    @Override
    public List<TrabalhoDTO> getAll() {
        List<TrabalhoEntity> trabalhos = trabalhoRepository.findByStatusOrderByDataHoraAbertaDesc(StatusTrabalho.ABERTO);
        return trabalhos.stream().map(mapper::toDTO).toList();
    }

    @Override
    public TrabalhoDTO findById(Long id) {
        TrabalhoEntity entity = trabalhoRepository.findById(id).orElseThrow(()
        -> new EntityNotFoundException("Trabalho do ID: " + id + " não encontrado " ));

        return mapper.toDTO(entity);
    }

    @Override
    public TrabalhoDTO save(TrabalhoRecord trabalhoRecord) {
        Trabalho TrabalhoModel = mapper.toModel(trabalhoRecord);

        UsuarioEntity usuario = usuarioRepository.findById(trabalhoRecord.idUsuario())
                .orElseThrow(() -> new EntityNotFoundException("Usuario do ID: " + trabalhoRecord.idUsuario()));
        TrabalhoEntity entityToSave = mapper.toEntity(TrabalhoModel);
        entityToSave.setUsuario(usuario);
        entityToSave.setDataHoraAberta(LocalDateTime.now());
        if (entityToSave.getStatus() == null) {
            entityToSave.setStatus(StatusTrabalho.ABERTO);
        }

        TrabalhoEntity saveEntity = trabalhoRepository.save(entityToSave);
        return mapper.toDTO(saveEntity);
    }

    @Override
    public TrabalhoDTO update(Long id, TrabalhoRecord trabalho) {
        Trabalho TrabalhoModel = mapper.toModel(trabalho);

        TrabalhoEntity entityToUpdate = trabalhoRepository.findById(id).orElseThrow(()
                -> new EntityNotFoundException("Trabalho do ID: " + id + "  nao encontrado "));

        mapper.updateEntityFromModel(TrabalhoModel, entityToUpdate);

        TrabalhoEntity entityUpdated = trabalhoRepository.save(entityToUpdate);

        return mapper.toDTO(entityUpdated);
    }


    @Override
    public void delete(Long id) {
        if (!trabalhoRepository.existsById(id)){
            throw new RuntimeException("Trabalho do ID: " + id + " nao encontrado ");
        }

        trabalhoRepository.deleteById(id);
    }




}
