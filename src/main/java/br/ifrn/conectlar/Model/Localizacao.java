package br.ifrn.conectlar.Model;

import jakarta.persistence.Embeddable;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
public class Localizacao {
    private String rua;
    private String bairro;
    private String numero;
    private String cidade;
    private String cep;
    private String estado;
    private String complemento;

    public Localizacao(String rua, String bairro, String numero, String cidade, String cep, String estado, String complemento) {

        this.rua = rua;
        this.bairro = bairro;
        this.numero = numero;
        this.cidade = cidade;
        this.cep = cep;
        this.estado = estado;
        this.complemento = complemento;

        validacao();
    }

    private void validacao() {
        // Validação: Verifica se é Nulo OU se está Vazio/Espaços
        if (rua == null || rua.isBlank()) {
            throw new IllegalArgumentException("A rua é obrigatória.");
        }

        if (bairro == null || bairro.isBlank()) {
            throw new IllegalArgumentException("O bairro é obrigatório.");
        }

        if (numero == null || numero.isBlank()) {
            throw new IllegalArgumentException("O número é obrigatório.");
        }

        if (cidade == null || cidade.isBlank()) {
            throw new IllegalArgumentException("A cidade é obrigatória.");
        }

        if (cep == null || cep.isBlank()) {
            throw new IllegalArgumentException("O CEP é obrigatório.");
        }

        // COMPLEMENTO NÃO ENTRA NA VALIDAÇÃO (É Opcional)
    }
}
