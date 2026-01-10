package br.ifrn.conectlar.Model.dto;

import java.math.BigDecimal;


public record TrabalhoRecord(
        LocalizacaoRecord localizacao,
        String problema,
        BigDecimal pagamento,
        String descricao,
        Long idUsuario
) {
}