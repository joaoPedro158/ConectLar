package br.ifrn.conectlar.Model.dto;


import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class UsuarioDTO {

    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private List<LocalizacaoDTO> localizacao;
    private String fotoPerfil;
    private UsuarioRole role;
}
