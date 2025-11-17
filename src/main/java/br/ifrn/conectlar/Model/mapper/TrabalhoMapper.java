package br.ifrn.conectlar.Model.mapper;

import br.ifrn.conectlar.Model.Entity.TrabalhoEntity;
import br.ifrn.conectlar.Model.Trabalho;
import br.ifrn.conectlar.Model.dto.TrabalhoDTO;
import br.ifrn.conectlar.Model.dto.TrabalhoRecord;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TrabalhoMapper {
    Trabalho  toModel(TrabalhoRecord record);
    @Mapping(source = "usuario.id", target = "idUsuario")
    TrabalhoDTO toDTO(TrabalhoEntity entity);
    TrabalhoEntity toEntity(Trabalho model);
}
