package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Entity.ProfissionalEntity;
import br.ifrn.conectlar.Model.Entity.TrabalhoEntity;
import br.ifrn.conectlar.Model.Entity.UsuarioEntity;
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
        List<TrabalhoEntity> entities = trabalhoRepository.findAll();
        return entities.stream().map(mapper::toDTO).toList();
    }

    @Override
    public TrabalhoDTO findById(Long id) {
        return null;
    }

    @Override
    public TrabalhoDTO save(TrabalhoRecord trabalhoRecord) {
        Trabalho TrabalhoModel = mapper.toModel(trabalhoRecord);

        UsuarioEntity usuario = usuarioRepository.findById(trabalhoRecord.idUsuario())
                .orElseThrow(() -> new EntityNotFoundException("Usuario do ID: " + trabalhoRecord.idUsuario()));


        TrabalhoEntity entityToSave = mapper.toEntity(TrabalhoModel);
        entityToSave.setUsuario(usuario);

        TrabalhoEntity saveEntity = trabalhoRepository.save(entityToSave);
        return mapper.toDTO(saveEntity);
    }

    @Override
    public TrabalhoDTO update(Long id, TrabalhoDTO dto) {
        return null;
    }

    @Override
    public void delete(Long id) {

    }
}
