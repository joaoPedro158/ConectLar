package br.ifrn.conectlar.Model.mapper;

import br.ifrn.conectlar.Model.Entity.ProfissionalEntity;
import br.ifrn.conectlar.Model.Profissional;
import br.ifrn.conectlar.Model.dto.ProfissionalRecord;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfissionalMapper {
    Profissional toModel(ProfissionalRecord record);
    ProfissionalEntity toEntity(Profissional model);

}
