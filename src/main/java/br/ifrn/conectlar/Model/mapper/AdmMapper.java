package br.ifrn.conectlar.Model.mapper;

import br.ifrn.conectlar.Model.Adm;
import br.ifrn.conectlar.Model.Entity.AdmEntity;
import br.ifrn.conectlar.Model.dto.AdmDTO;
import br.ifrn.conectlar.Model.dto.AdmRecord;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring")
public interface AdmMapper {
    Adm toModel(AdmRecord record);
    AdmEntity toEntity(Adm Model);
    AdmDTO toDTO(AdmEntity entity);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromModel(Adm model, @MappingTarget AdmEntity entity);
}
