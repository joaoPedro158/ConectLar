package br.ifrn.conectlar.Model.mapper;

import br.ifrn.conectlar.Model.Entity.ProfissionalEntity;
import br.ifrn.conectlar.Model.Profissional;
import br.ifrn.conectlar.Model.dto.ProfissionalDTO;
import br.ifrn.conectlar.Model.dto.ProfissionalRecord;
import org.mapstruct.*;


@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProfissionalMapper {
    Profissional toModel(ProfissionalRecord record);
    @Mapping(target = "senha", ignore = true)
    ProfissionalEntity toEntity(Profissional model);
    ProfissionalDTO toDTO(ProfissionalEntity entity);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromModel(Profissional model, @MappingTarget ProfissionalEntity entity);

    @AfterMapping
    default void validade(@MappingTarget Profissional model) {
        model.validacao();
    }
}
