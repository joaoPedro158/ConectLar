package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Enum.StatusTrabalho;
import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import br.ifrn.conectlar.Model.Usuario;
import br.ifrn.conectlar.Model.dto.TrabalhoDTO;
import br.ifrn.conectlar.Model.dto.UsuarioDTO;
import br.ifrn.conectlar.Model.dto.UsuarioRecord;
import br.ifrn.conectlar.Model.mapper.TrabalhoMapper;
import br.ifrn.conectlar.Model.mapper.UsuarioMapper;
import br.ifrn.conectlar.Repository.AvaliacaoJparepository;
import br.ifrn.conectlar.Repository.Entity.TrabalhoEntity;
import br.ifrn.conectlar.Repository.Entity.UsuarioEntity;
import br.ifrn.conectlar.Repository.TrabalhoJpaRepository;
import br.ifrn.conectlar.Repository.UsuarioJpaRepository;
import br.ifrn.conectlar.Service.SalvaArquivoService;
import br.ifrn.conectlar.Service.UsuarioService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Service
@AllArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioJpaRepository usuarioRepository;
    private final UsuarioMapper mapper;
    private final TrabalhoJpaRepository trabalhoRepository;
    private final TrabalhoMapper trabalhoMapper;
    private final AvaliacaoJparepository avaliacaoRepository;
    private final PasswordEncoder passwordEncoder;
    private final SalvaArquivoService salvaArquivoService;

    @Override
    @Transactional
    public UsuarioDTO saveUsuario(UsuarioRecord usuarioRecord, MultipartFile fotoPerfil) {
        Usuario usuarioModel = mapper.toModel(usuarioRecord);

        if (usuarioRepository.existsByEmail(usuarioModel.getEmail())) {
            throw new IllegalArgumentException("Já existe um usuário cadastrado com este e-mail.");
        }
        if (usuarioRepository.existsByTelefone(usuarioModel.getTelefone())) {
            throw new IllegalArgumentException("Já existe um usuário cadastrado com este telefone.");
        }
        UsuarioEntity entityToSave = mapper.toEntity(usuarioModel);
        String senhaCriptografada = passwordEncoder.encode(usuarioModel.getSenha());
        entityToSave.setSenha(senhaCriptografada);

        if (entityToSave.getRole() == null) {
            entityToSave.setRole(UsuarioRole.USUARIO);
        }

        try {
            if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
                String caminhoFoto = salvaArquivoService.salvaImagem(fotoPerfil);
                entityToSave.setFotoPerfil(caminhoFoto);
            }
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar a foto de perfil: " + e.getMessage());
        }

        UsuarioEntity savedEntity = usuarioRepository.save(entityToSave);
        return mapper.toDTO(savedEntity);
    }

    @Override
    public List<UsuarioDTO> getAll() {
        List<UsuarioEntity> entities = usuarioRepository.findAll();
        return entities.stream().map(mapper::toDTO).toList();
    }

    @Override
    public void deleteUsuario(Long id) {
        if (!usuarioRepository.existsById(id)){
            throw new RuntimeException("Usuário não encontrado com ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    @Override
    @Transactional
    public UsuarioDTO updateUsuario(Long id, UsuarioRecord usuario, MultipartFile fotoPerfil) {
        UsuarioEntity entityToUpdate = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com ID: " + id));

        Usuario usuarioModel = mapper.toModel(entityToUpdate);

        if (usuario != null){
            if (usuario.email() != null && !usuario.email().equals(usuarioModel.getEmail())) {
                if (usuarioRepository.findByEmailAndIdNot(usuario.email(), id).isPresent()) {
                    throw new IllegalArgumentException("Este e-mail já está em uso por outro usuário.");
                }
            }
            if (usuario.telefone() != null && !usuario.telefone().equals(usuarioModel.getTelefone())) {
                if (usuarioRepository.findByTelefoneAndIdNot(usuario.telefone(), id).isPresent()) {
                    throw new IllegalArgumentException("Este telefone já está em uso por outro usuário.");
                }
            }
            if (usuario.senha() != null && !usuario.senha().isBlank()) {
                usuarioModel.validarSenha(usuario.senha());
                String senhaCriptografada = passwordEncoder.encode(usuarioModel.getSenha());
                entityToUpdate.setSenha(senhaCriptografada);
            }
            usuarioModel.atualizarDados(
                    usuario.nome(),
                    usuario.email(),
                    usuario.telefone()

            );

            mapper.updateEntityFromModel(usuarioModel, entityToUpdate);
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

        UsuarioEntity updatedEntity = usuarioRepository.save(entityToUpdate);
        return mapper.toDTO(updatedEntity);
    }

    @Override
    public List<TrabalhoDTO> historico(Long id) {
        List<TrabalhoEntity> historicoEntities = trabalhoRepository.findByUsuarioIdOrderByDataHoraAbertaDesc(id);

        // Mapeia para DTO e verifica se cada um já foi avaliado
        return historicoEntities.stream().map(entidade -> {
            TrabalhoDTO dto = trabalhoMapper.toDTO(entidade);

            // Verifica no banco se existe avaliação vinculada ao ID deste trabalho
            boolean jaAvaliado = avaliacaoRepository.existsByTrabalhoId(entidade.getId());
            dto.setAvaliado(jaAvaliado);

            return dto;
        }).toList();
    }

    @Override
    public BigDecimal getGastoTotal(Long idUsuario) {
        List<TrabalhoEntity> trabalhos = trabalhoRepository.findAllByUsuarioIdAndStatus(idUsuario, StatusTrabalho.CONCLUIDO);

        return trabalhos.stream()
                .map(TrabalhoEntity::getPagamento)
                .filter(valor -> valor != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public UsuarioDTO getUsuario(Long id) {
        UsuarioEntity usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        return mapper.toDTO(usuario);
    }
}