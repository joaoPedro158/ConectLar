package br.ifrn.conectlar.Model.dto;

import java.time.LocalDateTime;

public record AvaliacaoRecord(
        int nota,
        String comentario
) {}
