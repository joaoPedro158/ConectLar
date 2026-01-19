package br.ifrn.conectlar.Service;


import br.ifrn.conectlar.Model.Entity.ProfissionalEntity;
import br.ifrn.conectlar.Model.Entity.TrabalhoEntity;
import br.ifrn.conectlar.Model.Entity.UsuarioEntity;
import br.ifrn.conectlar.Model.Enum.StatusTrabalho;
import br.ifrn.conectlar.Model.Trabalho;
import br.ifrn.conectlar.Model.dto.TrabalhoDTO;
import br.ifrn.conectlar.Model.dto.TrabalhoRecord;
import br.ifrn.conectlar.Model.mapper.TrabalhoMapper;
import br.ifrn.conectlar.Repository.ProfissionalJpaRepository;
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

    private final ProfissionalJpaRepository profissionalRepository;


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

    @Override
    public void solicitarTrabalho(Long idTrabalho, Long idProfissional) {
        TrabalhoEntity trabalho = trabalhoRepository.findById(idTrabalho)
                .orElseThrow(() -> new RuntimeException("Trabalho nao encontrado"));

        if (trabalho.getStatus() != StatusTrabalho.ABERTO) {
            throw new RuntimeException("Desculpe, este trabalho já foi reservado por outro profissional!");
        }

        ProfissionalEntity profissional = profissionalRepository.findById(idProfissional)
                .orElseThrow(() -> new RuntimeException("Profissional nao encontrado"));

        trabalho.setProfissional(profissional);
        trabalho.setStatus(StatusTrabalho.EM_ANDAMENTO);

        trabalhoRepository.save(trabalho);
    }

    @Override
    public List<TrabalhoDTO> BuscarProblema(String problema) {
        if (problema == null || problema.trim().isEmpty() ) {
            return getAll();
        }

        List<TrabalhoEntity> busca = trabalhoRepository.findByProblemaContainingIgnoreCaseAndStatusOrderByDataHoraAbertaDesc(problema, StatusTrabalho.ABERTO);

        return busca.stream().map(mapper::toDTO).toList() ;
    }


}
