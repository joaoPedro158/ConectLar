package br.ifrn.conectlar.Model.mapper;

import br.ifrn.conectlar.Model.Usuario;
import br.ifrn.conectlar.Model.dto.UsuarioDTO;
import br.ifrn.conectlar.Model.dto.UsuarioRecord;
import br.ifrn.conectlar.Model.Entity.UsuarioEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {


    Usuario toModel(UsuarioRecord record);


    @Mapping(target = "senha", ignore = true)
    UsuarioEntity toEntity(Usuario model);


    UsuarioDTO toDTO(UsuarioEntity entity);
}