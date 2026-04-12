package br.ifrn.conectlar.Model.dto.Record;


import br.ifrn.conectlar.Model.Enum.UsuarioRole;

public record UsuarioRecord(
        String nome,
        String email,
        String senha,
        String telefone,
        LocalizacaoRecord localizacao,
        UsuarioRole role) {
}
