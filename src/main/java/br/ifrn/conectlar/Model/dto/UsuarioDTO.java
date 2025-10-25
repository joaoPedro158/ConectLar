package br.ifrn.conectlar.Model.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UsuarioDTO {

    private Long id;
    private String nome;
    private String login;
    private String senha;
    private String email;
    private String telefone;
    private String localizacao;
}
