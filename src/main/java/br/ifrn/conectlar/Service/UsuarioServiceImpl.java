package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Model.Usuario;
import br.ifrn.conectlar.Model.dto.UsuarioDTO;
import br.ifrn.conectlar.Model.dto.UsuarioRecord;
import br.ifrn.conectlar.Model.Entity.UsuarioEntity;
import br.ifrn.conectlar.Model.mapper.UsuarioMapper;
import br.ifrn.conectlar.Repository.UsuarioJpaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}