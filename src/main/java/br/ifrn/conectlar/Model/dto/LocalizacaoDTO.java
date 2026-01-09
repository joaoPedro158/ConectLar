package br.ifrn.conectlar.Model.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LocalizacaoDTO {
    private String rua;
    private String bairro;
    private String numero;
    private String cidade;
    private String cep;
    private String estado;
}
