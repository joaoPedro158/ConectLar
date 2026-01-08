package br.ifrn.conectlar.Model;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class Adm {
    private Long id;
    private String nome;
    private String email;
    private String senha;
    private String role;

    protected Adm(Long id, String nome, String email, String senha, String role) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.role = role;

//        validacao();
    }

//    public void validacao() {
//
//    }
}


