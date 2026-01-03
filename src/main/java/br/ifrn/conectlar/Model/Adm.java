package br.ifrn.conectlar.Model;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class Adm {
    private Long id;
    private String nome;
    private String emailAdm;
    private String senhaAdm;
    private String role;

    protected Adm(Long id, String nome, String emailAdm, String senhaAdm, String role) {
        this.id = id;
        this.nome = nome;
        this.emailAdm = emailAdm;
        this.senhaAdm = senhaAdm;
        this.role = role;

//        validacao();
    }

//    public void validacao() {
//
//    }
}


