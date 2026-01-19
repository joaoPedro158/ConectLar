package br.ifrn.conectlar.Model.dto;

import br.ifrn.conectlar.Model.Enum.StatusTrabalho;

import java.math.BigDecimal;


public record TrabalhoRecord(
        LocalizacaoRecord localizacao,
        String problema,
        BigDecimal pagamento,
        String descricao,
        StatusTrabalho status,
        Long idUsuario,
        Long idProfissional
) {
}