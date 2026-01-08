package br.ifrn.conectlar.Model.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdmDTO {
    private Long id;
    private String nome;
    private String email;
    private String role;
}
