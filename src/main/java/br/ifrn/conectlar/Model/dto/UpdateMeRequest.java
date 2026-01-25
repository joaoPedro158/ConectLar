package br.ifrn.conectlar.Model.dto;

public record UpdateMeRequest(
        String nome,
        String telefone,
        LocalizacaoDTO localizacao
) {}
