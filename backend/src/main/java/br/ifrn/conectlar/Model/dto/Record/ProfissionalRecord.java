package br.ifrn.conectlar.Model.dto.Record;


import br.ifrn.conectlar.Model.Enum.CategoriaEnum;
import br.ifrn.conectlar.Model.Enum.UsuarioRole;

import java.util.List;

public record ProfissionalRecord(
        String nome,
        String email,
        String senha,
        List<LocalizacaoRecord> localizacao,
        String telefone,
        CategoriaEnum categoria,
        UsuarioRole role
){
}
