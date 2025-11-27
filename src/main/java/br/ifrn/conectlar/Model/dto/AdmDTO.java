package br.ifrn.conectlar.Model.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdmDTO {
    private Long id;
    private String nome;
    private String email_adm;
    private String senha_adm;
    private String login_adm;
}
