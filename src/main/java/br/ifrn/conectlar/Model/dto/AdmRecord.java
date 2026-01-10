package br.ifrn.conectlar.Model.dto;

import br.ifrn.conectlar.Model.Enum.UsuarioRole;

public record AdmRecord(
        String nome,
        String email,
        String senha,
        UsuarioRole role

) {
}
