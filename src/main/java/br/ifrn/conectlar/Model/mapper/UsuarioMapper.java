package br.ifrn.conectlar.Model.mapper;

import br.ifrn.conectlar.Model.Usuario;
import br.ifrn.conectlar.Model.dto.UsuarioDTO;
import br.ifrn.conectlar.Model.dto.UsuarioRecord;
import br.ifrn.conectlar.Model.Entity.UsuarioEntity;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    Usuario toModel(UsuarioRecord record);
    @Mapping(target = "senha", ignore = true)
    UsuarioEntity toEntity(Usuario model);
    UsuarioDTO toDTO(UsuarioEntity entity);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromModel(Usuario model, @MappingTarget UsuarioEntity entity);

    @AfterMapping
    default void validade(@MappingTarget Usuario model) {
        model.validacao();
    }
}