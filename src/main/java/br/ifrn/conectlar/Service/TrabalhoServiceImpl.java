package br.ifrn.conectlar.Service;


import br.ifrn.conectlar.Repository.Entity.ProfissionalEntity;
import br.ifrn.conectlar.Repository.Entity.TrabalhoEntity;
import br.ifrn.conectlar.Repository.Entity.UsuarioEntity;
import br.ifrn.conectlar.Model.Enum.CategoriaEnum;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@AllArgsConstructor
public class TrabalhoServiceImpl implements TrabalhoService {

    private final TrabalhoJpaRepository trabalhoRepository;
    private final TrabalhoMapper mapper;

    private final UsuarioJpaRepository usuarioRepository;

    private final ProfissionalJpaRepository profissionalRepository;

    private final SalvaArquivoService salvaArquivoService;


    @Override
    public List<TrabalhoDTO> getAll() {
        List<StatusTrabalho> statusExcluidos = Arrays.asList(
                StatusTrabalho.CONCLUIDO,
                StatusTrabalho.CANCELADO
        );
        List<TrabalhoEntity> trabalhos = trabalhoRepository.findByStatusNotInOrderByDataHoraAbertaDesc(statusExcluidos);

        return trabalhos.stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    public TrabalhoDTO findById(Long id) {
        TrabalhoEntity entity = trabalhoRepository.findById(id).orElseThrow(()
        -> new EntityNotFoundException("Trabalho do ID: " + id + " não encontrado " ));

        return mapper.toDTO(entity);
    }

    @Override
    public TrabalhoDTO save(TrabalhoRecord trabalhoRecord, MultipartFile arquivo, Long idUsuario) {
        UsuarioEntity usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuario não encontrado com ID: " + idUsuario));

        var trabalhoModel = mapper.toModel(trabalhoRecord);
        TrabalhoEntity entityToSave = mapper.toEntity(trabalhoModel);

        String caminhoImagem = null;
        try {
            if (arquivo != null && !arquivo.isEmpty()) {
                caminhoImagem = salvaArquivoService.salvaImagem(arquivo);
                entityToSave.setCaminhoImagem(caminhoImagem);
            }
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar o arquivo: " + e.getMessage());
        }

        entityToSave.setUsuario(usuario);
        entityToSave.setDataHoraAberta(LocalDateTime.now());

        if (entityToSave.getStatus() == null) {
            entityToSave.setStatus(StatusTrabalho.ABERTO);
        }

        TrabalhoEntity savedEntity = trabalhoRepository.save(entityToSave);
        return mapper.toDTO(savedEntity);
    }

    @Override
    public TrabalhoDTO update(Long id, TrabalhoRecord trabalho, MultipartFile arquivo) {

        TrabalhoEntity entityToUpdate = trabalhoRepository.findById(id).orElseThrow(()
                -> new EntityNotFoundException("Trabalho do ID: " + id + " nao encontrado"));

        if (trabalho != null) {
            Trabalho trabalhoModel = mapper.toModel(trabalho);
            mapper.updateEntityFromModel(trabalhoModel, entityToUpdate);
        }


        try {
            if (arquivo != null && !arquivo.isEmpty()) {

                String nomeArquivo = salvaArquivoService.salvaImagem(arquivo);

                entityToUpdate.setCaminhoImagem(nomeArquivo);
            }


        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar a nova foto: " + e.getMessage());
        }

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
        trabalho.setStatus(StatusTrabalho.EM_ESPERA);

        trabalhoRepository.save(trabalho);
    }

    @Override
    public void processarResposta(Long idTrabalho, boolean resposta) {
        TrabalhoEntity trabalho = trabalhoRepository.findById(idTrabalho)
                .orElseThrow(() -> new RuntimeException("Trabalho nao encontrado"));

        if (resposta) {
            trabalho.setStatus(StatusTrabalho.EM_ANDAMENTO);

        } else {
            trabalho.setStatus(StatusTrabalho.ABERTO);
            trabalho.setProfissional(null);
        }
        trabalhoRepository.save(trabalho);
    }

    @Override
    public void cancelarTrabalho(Long idTrabalho, Long  idUsuario) {
        TrabalhoEntity trabalho = trabalhoRepository.findById(idTrabalho)
                .orElseThrow(() -> new RuntimeException("Trabalho nao encontrado"));

        Trabalho trabalhoModel = mapper.toModel(trabalho);
        trabalhoModel.cancelarTrabalho(idUsuario);
        mapper.updateEntityFromModel(trabalhoModel, trabalho);

        trabalhoRepository.save(trabalho);
    }

    @Override
    public void concluirTrabalho(Long idTrabalho, Long idUsuario) {
        TrabalhoEntity trabalhoEntity = trabalhoRepository.findById(idTrabalho)
                .orElseThrow(() -> new RuntimeException("Trabalho nao encontrado"));
        Trabalho trabalhoModel = mapper.toModel(trabalhoEntity);
        trabalhoModel.concluir(idUsuario);
        mapper.updateEntityFromModel(trabalhoModel, trabalhoEntity);

        trabalhoRepository.save(trabalhoEntity);
    }

    @Override
    public List<TrabalhoDTO> BuscarProblema(String problema) {
        if (problema == null || problema.trim().isEmpty() ) {
            return getAll();
        }
        List<TrabalhoEntity> busca = trabalhoRepository.findByProblemaContainingIgnoreCaseAndStatusOrderByDataHoraAbertaDesc(problema, StatusTrabalho.ABERTO);

        return busca.stream().map(mapper::toDTO).toList() ;
    }


    @Override
    public List<TrabalhoDTO> filtroCategoria(CategoriaEnum categoria) {
       List<TrabalhoEntity> trabalhos = trabalhoRepository.findByCategoriaOrderByDataHoraAbertaDesc(categoria);
        return trabalhos.stream().map(mapper::toDTO).toList();
    }


}
