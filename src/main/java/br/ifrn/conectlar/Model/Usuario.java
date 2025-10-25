package br.ifrn.conectlar.Model; // Ou br.ifrn.conectlar.model;

import lombok.Builder;
import lombok.Getter;
import org.flywaydb.core.internal.util.StringUtils;

import java.util.regex.Pattern;


@Getter
public class Usuario {

    private Long id;
    private String nome;
    private String login;
    private String email;
    private String senha;
    private String telefone;

    // Padrão de e-mail (reaproveitado do seu Contact)
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    // Padrão de telefone (reaproveitado do seu Contact)
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\(\\d{2}\\)\\s\\d{5}-\\d{4}$");

    // Padrão para login: 3-20 caracteres, letras, números, underscore ou ponto.
    private static final Pattern LOGIN_PATTERN = Pattern.compile("^[a-zA-Z0-9_.]{3,20}$");

    // Mínimo de 8 caracteres para a senha
    private static final int MIN_PASSWORD_LENGTH = 8;

    @Builder
    private Usuario(Long id, String nome, String login, String email, String senha,String telefone) {
        this.id = id;
        this.nome = nome;
       this.login = login;
       this.email = email;
       this.senha = senha;
       this.telefone = telefone;


        validateInternalState();
    }

    private void validateInternalState() {

        // --- 1. Validação de Presença (Não Nulo/Vazio) ---

        if (!StringUtils.hasText(this.nome)) {
            throw new IllegalArgumentException("O nome do usuário não pode ser nulo ou vazio.");
        }
        if (!StringUtils.hasText(this.login)) {
            throw new IllegalArgumentException("O login do usuário não pode ser nulo ou vazio.");
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

        // --- 2. Validação de Formato (Regex) ---

        if (!EMAIL_PATTERN.matcher(this.email).matches()) {
            throw new IllegalArgumentException("O formato do e-mail é inválido.");
        }
        if (!PHONE_PATTERN.matcher(this.telefone).matches()) {
            throw new IllegalArgumentException("O formato do telefone é inválido. Use o formato (99) 99999-9999.");
        }
        if (!LOGIN_PATTERN.matcher(this.login).matches()) {
            throw new IllegalArgumentException("O login deve ter entre 3 e 20 caracteres e conter apenas letras, números, underscore (_) ou ponto (.).");
        }

        // --- 3. Validação de Regras de Negócio (Senha) ---

        // Regra 3.1: Comprimento mínimo
        if (this.senha.length() < MIN_PASSWORD_LENGTH) {
            throw new IllegalArgumentException("A senha deve ter no mínimo " + MIN_PASSWORD_LENGTH + " caracteres.");
        }

        // Regra 3.2: Pelo menos uma letra minúscula
        if (!this.senha.matches(".*[a-z].*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos uma letra minúscula.");
        }

        // Regra 3.3: Pelo menos uma letra maiúscula
        if (!this.senha.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos uma letra maiúscula.");
        }

        // Regra 3.4: Pelo menos um número
        if (!this.senha.matches(".*[0-9].*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos um número.");
        }
    }
}