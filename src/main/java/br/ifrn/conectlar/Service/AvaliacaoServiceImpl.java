package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Avaliacao;
import br.ifrn.conectlar.Model.dto.AvaliacaoDTO;
import br.ifrn.conectlar.Model.dto.AvaliacaoRecord;
import br.ifrn.conectlar.Model.mapper.AvaliacaoMapper;
import br.ifrn.conectlar.Repository.AvaliacaoJparepository;
import br.ifrn.conectlar.Repository.Entity.TrabalhoEntity;
import br.ifrn.conectlar.Repository.TrabalhoJpaRepository;
import br.ifrn.conectlar.Service.AvaliacaoService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class AvaliacaoServiceImpl implements AvaliacaoService {

    private final AvaliacaoJparepository avaliacaoRepository;
    private final TrabalhoJpaRepository trabalhoRepository;
    private final AvaliacaoMapper avaliacaoMapper;

    @Override
    @Transactional
    public AvaliacaoDTO avaliar(AvaliacaoRecord record, Long idTrabalho) {
        TrabalhoEntity trabalhoEntity = trabalhoRepository.findById(idTrabalho)
                .orElseThrow(() -> new RuntimeException("Trabalho não encontrado"));

        Avaliacao avaliacao = avaliacaoMapper.toModel(record, trabalhoEntity);


        var entity = avaliacaoMapper.toEntity(avaliacao);
        var salva = avaliacaoRepository.save(entity);

        return avaliacaoMapper.toDTO(salva);
    }
}