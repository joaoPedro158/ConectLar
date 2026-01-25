package br.ifrn.conectlar.Model.dto;

import br.ifrn.conectlar.Model.Enum.UsuarioRole;

public record MeResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        UsuarioRole role,
        LocalizacaoDTO localizacao
) {}
