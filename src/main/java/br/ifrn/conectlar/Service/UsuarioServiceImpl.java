package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Usuario;
import br.ifrn.conectlar.Model.dto.UsuarioDTO;
import br.ifrn.conectlar.Model.dto.UsuarioRecord;
import br.ifrn.conectlar.Model.Entity.UsuarioEntity;
import br.ifrn.conectlar.Model.mapper.UsuarioMapper;
import br.ifrn.conectlar.Repository.UsuarioJpaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {


    private final UsuarioJpaRepository usuarioRepository;
    private final UsuarioMapper mapper;


    @Override
    @Transactional
    public UsuarioDTO saveUsuario(UsuarioRecord usuarioRecord) {
        Usuario usuarioModel = mapper.toModel(usuarioRecord);

        if (usuarioRepository.existsByEmail(usuarioModel.getEmail())) {
            throw new IllegalArgumentException("Já existe um usuário cadastrado com este e-mail.");
        }
        if (usuarioRepository.existsByTelefone(usuarioModel.getTelefone())) {
            throw new IllegalArgumentException("Já existe um usuário cadastrado com este telefone.");
        }
        UsuarioEntity entityToSave = mapper.toEntity(usuarioModel);
        entityToSave.setSenha(usuarioModel.getSenha());
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
    public UsuarioDTO updateUsuario(Long id, UsuarioRecord usuario) {
        Usuario usuarioModel = mapper.toModel(usuario);


        UsuarioEntity entityToUpdate = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com ID: " + id));


        if (usuarioRepository.findByEmailAndIdNot(usuarioModel.getEmail(), id).isPresent()) {
            throw new IllegalArgumentException("Este e-mail já está em uso por outro usuário.");
        }
        if (usuarioRepository.findByLoginAndIdNot(usuarioModel.getLogin(), id).isPresent()) {
            throw new IllegalArgumentException("Este login já está em uso por outro usuário.");
        }
        if (usuarioRepository.findByTelefoneAndIdNot(usuarioModel.getTelefone(), id).isPresent()) {
            throw new IllegalArgumentException("Este telefone já está em uso por outro usuário.");
        }
        mapper.updateEntityFromModel(usuarioModel, entityToUpdate);
        entityToUpdate.setSenha(usuarioModel.getSenha());
        UsuarioEntity updatedEntity = usuarioRepository.save(entityToUpdate);

        return mapper.toDTO(updatedEntity);
    }
}