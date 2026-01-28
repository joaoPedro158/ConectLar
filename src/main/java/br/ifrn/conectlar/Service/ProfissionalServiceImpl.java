package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Enum.StatusTrabalho;
import br.ifrn.conectlar.Model.dto.DadosProfissionalDTO;
import br.ifrn.conectlar.Repository.Entity.AvaliacaoEntity;
import br.ifrn.conectlar.Repository.Entity.ProfissionalEntity;
import br.ifrn.conectlar.Repository.Entity.TrabalhoEntity;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
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
    private SalvaArquivoService salvaArquivoService;

    @Override
    public ProfissionalDTO saveProfissional(ProfissionalRecord profissionalRecord, MultipartFile fotoPerfil) {
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
        try {
            if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
                String caminhoFoto = salvaArquivoService.salvaImagem(fotoPerfil);
                entityToSave.setFotoPerfil(caminhoFoto);
            }
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar a foto de perfil: " + e.getMessage());
        }

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
    public ProfissionalDTO updateProfissional(Long id, ProfissionalRecord profissionalRecord,MultipartFile fotoPerfil ) {
        ProfissionalEntity entityToUpdate = profissionalRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("o profissional não encontrado com o ID: " + id ));

        if (profissionalRecord != null) {
            Profissional profissionalModel = mapper.toModel(profissionalRecord);
            if (profissionalRepository.findByEmailAndIdNot(profissionalModel.getEmail(), id).isPresent()) {
                throw new IllegalArgumentException("Este e-mail ja esta em uso por outro profissional.");
            }
            if (profissionalRepository.findByTelefoneAndIdNot(profissionalModel.getTelefone(), id).isPresent()) {
                throw new IllegalArgumentException("Este telefone ja esta em uso por outro profissional.");
            }
            mapper.updateEntityFromModel(profissionalModel, entityToUpdate);
           if (profissionalModel.getSenha() != null && !profissionalModel.getSenha().isBlank()) {
               String senhaCriptografada = passwordEncoder.encode(profissionalModel.getSenha());
               entityToUpdate.setSenha(senhaCriptografada);
           }
        }
        try {
            if (fotoPerfil != null && !fotoPerfil.isEmpty()) {

                String fotoAntiga = entityToUpdate.getFotoPerfil();
                if (fotoAntiga != null && !fotoAntiga.isBlank()) {
                    try {
                        Files.deleteIfExists(Paths.get("upload/" + fotoAntiga));
                    } catch (IOException e) {
                        System.out.println("Não foi possível apagar a foto antiga: " + e.getMessage());
                    }
                }
                String novaFoto = salvaArquivoService.salvaImagem(fotoPerfil);

                entityToUpdate.setFotoPerfil(novaFoto);
            }
        } catch (IOException e) {
            throw new RuntimeException("Erro ao atualizar foto de perfil: " + e.getMessage());
        }

        ProfissionalEntity updateEntity = profissionalRepository.save(entityToUpdate);
        return mapper.toDTO(updateEntity);
    }

    @Override
    public List<TrabalhoDTO> historico(Long id) {
        List<TrabalhoEntity> historico = trabalhoRepository.findByProfissionalIdOrderByDataHoraAbertaDesc(id);
        return historico.stream().map(trabalhoMapper::toDTO).toList();
    }

    @Override
    public ProfissionalDTO getProfissional(Long id) {
        ProfissionalEntity profissional = profissionalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("profissional nao encontrado"));
        return mapper.toDTO(profissional);
    }

    @Override
    public DadosProfissionalDTO getDadosProfissional(Long idProfissional) {

        ProfissionalEntity profissional = profissionalRepository.findById(idProfissional)
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));

        List<TrabalhoEntity> trabalhos = trabalhoRepository.findAllByProfissionalId(idProfissional);

        BigDecimal totalGanho = trabalhos.stream()
                .filter(t -> t.getStatus() == StatusTrabalho.CONCLUIDO)
                .filter(t -> t.getPagamento() != null)
                .map(TrabalhoEntity::getPagamento)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Double mediaAvaliacao = trabalhos.stream()
                .map(TrabalhoEntity::getAvaliacao)
                .filter(avaliacao -> avaliacao != null)
                .mapToDouble(AvaliacaoEntity::getNota)
                .average()
                .orElse(0.0);

        int totalPedidos = (int) trabalhos.stream()
                .filter(t -> t.getStatus() == StatusTrabalho.CONCLUIDO)
                .count();

        int totalPendentes = (int) trabalhos.stream()
                .filter(t -> t.getStatus() == StatusTrabalho.EM_ANDAMENTO)
                .count();

        return DadosProfissionalDTO.builder()
                .mediaAvaliacao(mediaAvaliacao)
                .lucroTotal(totalGanho)
                .pedidosConcluido(totalPedidos)
                .pedidosAndamento(totalPendentes)
                .build();
    }

}
