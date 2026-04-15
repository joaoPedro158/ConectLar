package br.ifrn.conectlar.Model.mapper;

import br.ifrn.conectlar.Model.Localizacao;
import br.ifrn.conectlar.Model.dto.LocalizacaoDTO;
import br.ifrn.conectlar.Model.dto.Record.LocalizacaoRecord;
import br.ifrn.conectlar.Repository.Entity.LocalizacaoEntity;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface LocalizacaoMapper {
    Localizacao toModel(LocalizacaoRecord localizacao);
    LocalizacaoEntity toEntity( Localizacao  localizacao );
    LocalizacaoDTO toDTO(LocalizacaoEntity localizacaoEntity);
}
