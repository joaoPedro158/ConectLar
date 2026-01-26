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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    public TrabalhoDTO save(TrabalhoRecord trabalhoRecord, List<MultipartFile> arquivos, Long idUsuario) {
        Trabalho TrabalhoModel = mapper.toModel(trabalhoRecord);

        UsuarioEntity usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuario do ID: " + idUsuario));
        TrabalhoEntity entityToSave = mapper.toEntity(TrabalhoModel);
        List<String> caminhosImagem = new ArrayList<>();
        try {
            if (arquivos != null && !arquivos.isEmpty()) {
                for (MultipartFile arquivo : arquivos) {
                    if (!arquivo.isEmpty()) {
                        String nomeArquivo = salvaArquivoService.salvaImagem(arquivo);
                        caminhosImagem.add(nomeArquivo);
                    }
                }
            }
        } catch (IOException e) {
            throw  new RuntimeException("Erro ao salvar do arquivo");
        }


        entityToSave.setImagens(caminhosImagem);
        entityToSave.setUsuario(usuario);
        entityToSave.setDataHoraAberta(LocalDateTime.now());
        if (entityToSave.getStatus() == null) {
            entityToSave.setStatus(StatusTrabalho.ABERTO);
        }

        TrabalhoEntity saveEntity = trabalhoRepository.save(entityToSave);
        return mapper.toDTO(saveEntity);
    }

    @Override
    public TrabalhoDTO update(Long id, TrabalhoRecord trabalho, List<MultipartFile> arquivos) {
        TrabalhoEntity entityToUpdate = trabalhoRepository.findById(id).orElseThrow(()
                -> new EntityNotFoundException("Trabalho do ID: " + id + "  nao encontrado "));
        if (trabalho != null) {
            Trabalho TrabalhoModel = mapper.toModel(trabalho);
            mapper.updateEntityFromModel(TrabalhoModel, entityToUpdate);
        }
        // 3. LÓGICA DE ATUALIZAÇÃO DAS FOTOS 🖼️
        try {
            // Verifica se chegou uma lista e se ela tem itens
            if (arquivos != null && !arquivos.isEmpty()) {
                // Garante que a lista da entidade não está nula (evita NullPointerException)
                if (entityToUpdate.getImagens() == null) {
                    entityToUpdate.setImagens(new ArrayList<>());
                }

                for (MultipartFile arquivo : arquivos) {
                    // Só processa se o arquivo tiver conteúdo
                    if (!arquivo.isEmpty()) {
                        // Salva no disco/bucket
                        String nomeArquivo = salvaArquivoService.salvaImagem(arquivo);

                        // ADICIONA na lista existente (JPA vai inserir na tabela auxiliar automaticamente)
                        entityToUpdate.getImagens().add(nomeArquivo);
                    }
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar novas fotos: " + e.getMessage());
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


        if (!trabalho.getUsuario().getId().equals(idUsuario)) {
            throw new AccessDeniedException("Você não tem permissão para cancelar este trabalho.");
        }

        if (trabalho.getStatus() == StatusTrabalho.CONCLUIDO) {
            throw new IllegalStateException("Não é possível cancelar um trabalho que já foi concluído.");
        }

        if (trabalho.getStatus() == StatusTrabalho.CANCELADO) {
            throw new IllegalStateException("Este trabalho já foi cancelado anteriormente.");
        }




        trabalho.setStatus(StatusTrabalho.CANCELADO);

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
