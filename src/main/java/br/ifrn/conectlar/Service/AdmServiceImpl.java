package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Adm;
import br.ifrn.conectlar.Model.Entity.AdmEntity;
import br.ifrn.conectlar.Model.dto.AdmDTO;
import br.ifrn.conectlar.Model.dto.AdmRecord;
import br.ifrn.conectlar.Model.mapper.AdmMapper;
import br.ifrn.conectlar.Repository.AdmJpaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AdmServiceImpl implements AdmService {

    private final AdmJpaRepository admRepository;
    private final AdmMapper admMapper;
    @Override
    public AdmDTO save(AdmRecord record) {
        Adm admModel = admMapper.toModel(record);

        AdmEntity EntityToSave =admMapper.toEntity(admModel);
        AdmEntity SavedEntity = admRepository.save(EntityToSave);

        return admMapper.toDTO(SavedEntity);
    }

    @Override
    public List<AdmDTO> getAll() {
        List<AdmEntity> Entity = admRepository.findAll();
        return Entity.stream().map(admMapper::toDTO).toList();
    }

    @Override
    public AdmDTO findById(Long id) {
        AdmEntity entity = admRepository.findById(id).orElseThrow(()
        -> new EntityNotFoundException("Adm do ID: " + id + " nao encontrado "));

        return admMapper.toDTO(entity);
    }

    @Override
    public AdmDTO update(Long id, AdmRecord record) {
        Adm admModel = admMapper.toModel(record);

        AdmEntity entityToUpadate = admRepository.findById(id).orElseThrow(()
         -> new EntityNotFoundException("Trabalho do ID: " + id + "  nao encontrado "));

        admMapper.updateEntityFromModel(admModel, entityToUpadate);

        AdmEntity entityUpdate = admRepository.save(entityToUpadate);

        return admMapper.toDTO(entityUpdate);
    }

    @Override
    public void delete(Long id) {
        if (!admRepository.existsById(id)){
            throw new RuntimeException("Adm do ID: " + id + " nao encontrado ");
        }
        admRepository.deleteById(id);

    }
}
