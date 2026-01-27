package br.ifrn.conectlar.Model.mapper;

import br.ifrn.conectlar.Repository.Entity.TrabalhoEntity;
import br.ifrn.conectlar.Model.Trabalho;
import br.ifrn.conectlar.Model.dto.TrabalhoDTO;
import br.ifrn.conectlar.Model.dto.TrabalhoRecord;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TrabalhoMapper {
    Trabalho toModel(TrabalhoRecord record);
    
    @Mapping(source = "usuario.id", target = "idUsuario")
    @Mapping(source = "profissional.id", target = "idProfissional")
    Trabalho toModel(TrabalhoEntity  entity);

    @Mapping(source = "usuario.id", target = "idUsuario")
    @Mapping(source = "usuario.nome", target = "nomeUsuario")
    @Mapping(source = "profissional.id", target = "idProfissional")
    @Mapping(source = "profissional.nome", target = "nomeProfissional")
    TrabalhoDTO toDTO(TrabalhoEntity entity);
    TrabalhoEntity toEntity(Trabalho model);

    @Mapping(target = "dataHoraAberta", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updateEntityFromModel(Trabalho model, @MappingTarget TrabalhoEntity entity);
}
