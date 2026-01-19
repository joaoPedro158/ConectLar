package br.ifrn.conectlar.Model.dto;

public record LocalizacaoRecord(
   String rua,
   String bairro,
   String numero,
   String cidade,
   String cep,
   String estado,
   String complemento
) {}
