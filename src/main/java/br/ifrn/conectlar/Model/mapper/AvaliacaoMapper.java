package br.ifrn.conectlar.Model.mapper;

import br.ifrn.conectlar.Model.Avaliacao;
import br.ifrn.conectlar.Repository.Entity.AvaliacaoEntity;
import br.ifrn.conectlar.Model.dto.AvaliacaoDTO;
import br.ifrn.conectlar.Model.dto.AvaliacaoRecord;
import br.ifrn.conectlar.Repository.Entity.TrabalhoEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AvaliacaoMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "trabalho", source = "trabalhoEntity")
    Avaliacao toModel(AvaliacaoRecord record, TrabalhoEntity trabalhoEntity);
    AvaliacaoEntity toEntity(Avaliacao model);
    AvaliacaoDTO toDTO(AvaliacaoEntity entity);
}
