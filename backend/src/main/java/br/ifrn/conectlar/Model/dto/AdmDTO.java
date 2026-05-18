package br.ifrn.conectlar.Model.dto;

import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdmDTO {
    private Long id;
    private String nome;
    private String email;
    private UsuarioRole role;
}
