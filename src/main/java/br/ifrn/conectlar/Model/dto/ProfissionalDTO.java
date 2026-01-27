package br.ifrn.conectlar.Model.dto;


import br.ifrn.conectlar.Model.Enum.CategoriaEnum;
import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ProfissionalDTO {
    private Long id;
    private String nome;
    private String email;
    private LocalizacaoDTO localizacao;
    private String telefone;
    private CategoriaEnum categoria;
    private UsuarioRole role;
}
