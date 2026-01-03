package br.ifrn.conectlar.Model.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdmDTO {
    private Long id;
    private String nome;
    private String emailAdm;
    private String senhaAdm;
    private String role;
}
