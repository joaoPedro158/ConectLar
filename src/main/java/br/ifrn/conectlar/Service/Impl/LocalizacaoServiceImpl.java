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

import java.util.List;

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
        Localizacao localizacaoModel = mapper.toModel(localizacao);
        LocalizacaoEntity entityToSave = mapper.toEntity(localizacaoModel);
        repository.save(entityToSave);

        List<LocalizacaoEntity> listaDoDono = buscarListaLocalizacoesPorRole(role,id);
        listaDoDono.add(entityToSave);

        return mapper.toDTO(entityToSave);
    }

    @Override
    public List<LocalizacaoDTO> listaLocalizacao( UsuarioRole role, Long id) {
        List<LocalizacaoEntity> entidades = buscarListaLocalizacoesPorRole(role,id);

        return mapper.toDTOlist(entidades);
    }

    // auxilixar
    private List<LocalizacaoEntity> buscarListaLocalizacoesPorRole(UsuarioRole role, Long id) {
        return switch (role) {
            case USUARIO -> usuarioRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado!"))
                    .getLocalizacao(); // Retorna a lista do Usuario

            case PROFISSIONAL -> profissionalRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Profissional não encontrado!"))
                    .getLocalizacao(); // Retorna a lista do Profissional

            default -> throw new RuntimeException("Role não suportada: " + role);
        };
    }

}
