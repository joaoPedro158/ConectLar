package br.ifrn.conectlar.Model.mapper;

import br.ifrn.conectlar.Model.Usuario;
import br.ifrn.conectlar.Model.dto.Record.LocalizacaoRecord;
import br.ifrn.conectlar.Model.dto.UsuarioDTO;
import br.ifrn.conectlar.Model.dto.Record.UsuarioRecord;
import br.ifrn.conectlar.Repository.Entity.LocalizacaoEntity;
import br.ifrn.conectlar.Repository.Entity.UsuarioEntity;
import org.mapstruct.*;

import java.util.List;


@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UsuarioMapper {
    Usuario toModel(UsuarioRecord record);
    Usuario toModel(UsuarioEntity entity);
    @Mapping(target = "senha", ignore = true)
    UsuarioEntity toEntity(Usuario model);
    LocalizacaoEntity toEntityLocalizacao(LocalizacaoRecord record);
    UsuarioDTO toDTO(UsuarioEntity entity);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromModel(Usuario model, @MappingTarget UsuarioEntity entity);


}