package br.ifrn.conectlar.Model.mapper;

import br.ifrn.conectlar.Model.Entity.ProfissionalEntity;
import br.ifrn.conectlar.Model.Profissional;
import br.ifrn.conectlar.Model.dto.ProfissionalDTO;
import br.ifrn.conectlar.Model.dto.ProfissionalRecord;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring")
public interface ProfissionalMapper {
    Profissional toModel(ProfissionalRecord record);
    ProfissionalEntity toEntity(Profissional model);
    ProfissionalDTO toDTO(ProfissionalEntity entity);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromModel(Profissional model, @MappingTarget ProfissionalEntity entity);

}
