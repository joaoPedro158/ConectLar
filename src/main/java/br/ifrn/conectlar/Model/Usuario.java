package br.ifrn.conectlar.Model; // Ou br.ifrn.conectlar.model;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.flywaydb.core.internal.util.StringUtils;

import java.util.regex.Pattern;


@Getter
@SuperBuilder
public class Usuario {

    private Long id;
    private String nome;
    private String email;
    private String senha;
    private String telefone;
    private String localizacao;
    private String role;


    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\(\\d{2}\\)\\s\\d{5}-\\d{4}$");
    private static final Pattern LOGIN_PATTERN = Pattern.compile("^[a-zA-Z0-9_.]{3,20}$");
    private static final int MIN_PASSWORD_LENGTH = 8;


    protected Usuario(Long id, String nome, String email, String senha,String telefone,String localizacao,String role) {
        this.id = id;
        this.nome = nome;
       this.email = email;
       this.senha = senha;
       this.telefone = telefone;
       this.localizacao = localizacao;
       this.role = role;


        validacao();
    }



    public void validacao() {

        if (!StringUtils.hasText(this.nome)) {
            throw new IllegalArgumentException("O nome do usuário não pode ser nulo ou vazio.");
        }
        if (!StringUtils.hasText(this.email)) {
            throw new IllegalArgumentException("O e-mail do usuário não pode ser nulo ou vazio.");
        }
        if (!StringUtils.hasText(this.senha)) {
            throw new IllegalArgumentException("A senha do usuário não pode ser nula ou vazia.");
        }
        if (!StringUtils.hasText(this.telefone)) {
            throw new IllegalArgumentException("O telefone do usuário não pode ser nulo ou vazio.");
        }



        if (!EMAIL_PATTERN.matcher(this.email).matches()) {
            throw new IllegalArgumentException("O formato do e-mail é inválido.");
        }
        if (!PHONE_PATTERN.matcher(this.telefone).matches()) {
            throw new IllegalArgumentException("O formato do telefone é inválido. Use o formato (99) 99999-9999.");
        }



        if (this.senha.length() < MIN_PASSWORD_LENGTH) {
            throw new IllegalArgumentException("A senha deve ter no mínimo " + MIN_PASSWORD_LENGTH + " caracteres.");
        }


        if (!this.senha.matches(".*[a-z].*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos uma letra minúscula.");
        }


        if (!this.senha.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos uma letra maiúscula.");
        }


        if (!this.senha.matches(".*[0-9].*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos um número.");
        }

    }
}