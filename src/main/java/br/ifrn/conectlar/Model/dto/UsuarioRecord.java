package br.ifrn.conectlar.Model.dto;

public record UsuarioRecord(
        String nome,
        String email,
        String senha,
        String telefone,
        String localizacao) {
}
