package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Avaliacao;
import br.ifrn.conectlar.Repository.Entity.AvaliacaoEntity;
import br.ifrn.conectlar.Repository.Entity.TrabalhoEntity;
import br.ifrn.conectlar.Model.dto.AvaliacaoDTO;
import br.ifrn.conectlar.Model.dto.AvaliacaoRecord;
import br.ifrn.conectlar.Model.mapper.AvaliacaoMapper;
import br.ifrn.conectlar.Repository.AvaliacaoJparepository;
import br.ifrn.conectlar.Repository.TrabalhoJpaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class AvaliacaoServiceImpl implements AvaliacaoService {

    private final TrabalhoJpaRepository  trabalhoJpaRepository;

    private final AvaliacaoMapper avaliacaoMapper;
    private final AvaliacaoJparepository avaliacaoJparepository;
    @Override
    public AvaliacaoDTO avaliar(AvaliacaoRecord avaliacaoRecord, Long idTrabalho) {
        if (avaliacaoJparepository.existsByTrabalhoId(idTrabalho)) {
            throw new IllegalArgumentException("Este trabalho já foi avaliado anteriormente.");
        }

        TrabalhoEntity trabalho = trabalhoJpaRepository.findById(idTrabalho)
                .orElseThrow(() -> new EntityNotFoundException("Trabalho não encontrado com o ID: " + idTrabalho));

        Avaliacao avaliacaoModel = avaliacaoMapper.toModel(avaliacaoRecord, trabalho);
        AvaliacaoEntity entityToSave = avaliacaoMapper.toEntity(avaliacaoModel);

        entityToSave.setDataAvaliacao(LocalDateTime.now());

        AvaliacaoEntity saveEntity = avaliacaoJparepository.save(entityToSave);
        return avaliacaoMapper.toDTO(saveEntity);
    }
}
