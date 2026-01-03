package br.ifrn.conectlar.Model.dto;

public record ProfissionalRecord(
        String nome,
        String email,
        String senha,
        String localizacao,
        String telefone,
        String categoria,
        String role
){
}
