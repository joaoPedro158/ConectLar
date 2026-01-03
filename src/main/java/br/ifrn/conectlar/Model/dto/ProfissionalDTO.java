package br.ifrn.conectlar.Model.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ProfissionalDTO {
    private Long id;
    private String nome;
    private String email;
    private String senha;
    private String localizacao;
    private String telefone;
    private String categoria;
    private String role;
}
