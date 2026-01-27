package br.ifrn.conectlar.Model.mapper;

import br.ifrn.conectlar.Model.Avaliacao;
import br.ifrn.conectlar.Model.Entity.AvaliacaoEntity;
import br.ifrn.conectlar.Model.dto.AvaliacaoDTO;
import br.ifrn.conectlar.Model.dto.AvaliacaoRecord;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AvaliacaoMapper {
    Avaliacao toModel(AvaliacaoRecord record);
    AvaliacaoEntity toEntity(Avaliacao model);
    AvaliacaoDTO toDTO(AvaliacaoEntity entity);
}
