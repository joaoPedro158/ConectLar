package br.ifrn.conectlar.Model;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class Adm {
    private Long id;
    private String nome;
    private String email_adm;
    private String senha_adm;
    private String login_adm;

    protected Adm(Long id, String nome, String email_adm, String senha_adm, String login_adm) {
        this.id = id;
        this.nome = nome;
        this.email_adm = email_adm;
        this.senha_adm = senha_adm;
        this.login_adm = login_adm;

//        validacao();
    }

//    public void validacao() {
//
//    }
}


