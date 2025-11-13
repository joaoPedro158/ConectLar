package br.ifrn.conectlar.Model.dto;

public record ProfissionalRecord(
        String nome,
        String email,
        String login,
        String senha,
        String localizacao,
        String telefone,
        String funcao
){
}
