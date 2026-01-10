package br.ifrn.conectlar.Model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Localizacao {
    private String rua;
    private String bairro;
    private String numero;
    private String cidade;
    private String cep;
    private String estado;
    private String Complemento;
}
