package br.ifrn.conectlar.Service.Impl;

import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import br.ifrn.conectlar.Model.Localizacao;
import br.ifrn.conectlar.Model.dto.LocalizacaoDTO;
import br.ifrn.conectlar.Model.dto.Record.LocalizacaoRecord;
import br.ifrn.conectlar.Model.mapper.LocalizacaoMapper;
import br.ifrn.conectlar.Repository.Entity.LocalizacaoEntity;
import br.ifrn.conectlar.Repository.Entity.ProfissionalEntity;
import br.ifrn.conectlar.Repository.Entity.UsuarioEntity;
import br.ifrn.conectlar.Repository.LocalizacaoRepository;
import br.ifrn.conectlar.Repository.ProfissionalJpaRepository;
import br.ifrn.conectlar.Repository.UsuarioJpaRepository;
import br.ifrn.conectlar.Service.LocalizacaoService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class LocalizacaoServiceImpl implements LocalizacaoService {

    private final LocalizacaoMapper mapper;
    private final LocalizacaoRepository repository;
    private final ProfissionalJpaRepository profissionalRepository;
    private final UsuarioJpaRepository usuarioRepository;

    @Override
    @Transactional
    public LocalizacaoDTO cadastralocalizacao(LocalizacaoRecord localizacao, UsuarioRole role, Long id) {
        String roleEnum = role.getRole();
        Localizacao localizacaoModel = mapper.toModel(localizacao);
        LocalizacaoEntity entityToSave = mapper.toEntity(localizacaoModel);
        repository.save(entityToSave);

        // 3. Usa o Enum no switch ou if
        switch (roleEnum) {
            case "usuario" -> {
                UsuarioEntity usuario = usuarioRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Cliente não encontrado!"));

                // O Lombok criou o getLocalizacoes() automaticamente
                usuario.getLocalizacao().add(entityToSave);
                usuarioRepository.save(usuario);
            }
            case "profissional" -> {
                ProfissionalEntity profissional = profissionalRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Profissional não encontrado!"));

                profissional.getLocalizacao().add(entityToSave);
                profissionalRepository.save(profissional);
            }
            default -> throw new RuntimeException("Role não suportada para localização: " + role);

        }
        return mapper.toDTO(entityToSave);
    }
}
