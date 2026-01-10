package br.ifrn.conectlar.Model.dto;


import br.ifrn.conectlar.Model.Enum.UsuarioRole;

public record ProfissionalRecord(
        String nome,
        String email,
        String senha,
        LocalizacaoRecord localizacao,
        String telefone,
        String categoria,
        UsuarioRole role
){
}
