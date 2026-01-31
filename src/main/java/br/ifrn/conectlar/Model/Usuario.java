package br.ifrn.conectlar.Model;

import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import lombok.Getter;
import lombok.experimental.SuperBuilder;


import java.util.regex.Pattern;


@Getter
@SuperBuilder
public class Usuario {

    private Long id;
    private String nome;
    private String email;
    private String senha;
    private String telefone;
    private Localizacao localizacao;
    private String fotoPerfil;
    private UsuarioRole role;


    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\(\\d{2}\\)\\s\\d{5}-\\d{4}$");
    private static final int MIN_PASSWORD_LENGTH = 8;


    protected Usuario(Long id, String nome, String email, String senha,String telefone,Localizacao localizacao, String fotoPerfil,UsuarioRole role) {
        this.id = id;
        this.nome = nome;
       this.email = email;
       this.senha = senha;
       this.telefone = telefone;
       this.localizacao = localizacao;
       this.fotoPerfil = fotoPerfil;
       this.role = role;


        validacao();
    }



    public void validacao() {


        if (this.nome == null || this.nome.trim().length() < 3) {
            throw new IllegalArgumentException("O nome do usuário é obrigatório e deve ter pelo menos 3 letras.");
        }

        if (this.localizacao == null) {
            throw new IllegalArgumentException("A localização (endereço) é obrigatória para o cadastro.");
        }


        if (this.email == null || this.email.isBlank()) {
            throw new IllegalArgumentException("O e-mail é obrigatório.");
        }

        if (!EMAIL_PATTERN.matcher(this.email).matches()) {
            throw new IllegalArgumentException("O formato do e-mail é inválido. Exemplo correto: usuario@email.com");
        }

        if (this.telefone == null || this.telefone.isBlank()) {
            throw new IllegalArgumentException("O telefone é obrigatório.");
        }

        if (!PHONE_PATTERN.matcher(this.telefone).matches()) {
            throw new IllegalArgumentException("O telefone deve estar no formato: (XX) XXXXX-XXXX");
        }


        if (this.senha == null || this.senha.isBlank()) {
            throw new IllegalArgumentException("A senha é obrigatória.");
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

    public void atualizarDados(String nome, String email, String telefone) {
        if (nome != null && !nome.isBlank()) {
            validarNome(nome);
            this.nome = nome;
        }

        if (email != null && !email.isBlank()) {
            validarEmail(email);
            this.email = email;
        }

        if (telefone != null && !telefone.isBlank()) {
            validarTelefone(telefone);
            this.telefone = telefone;
        }

    }

    private void validarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        if (nome.length() < 3) {
            throw new IllegalArgumentException("Nome deve ter no mínimo 3 caracteres");
        }
        if (nome.length() > 100) {
            throw new IllegalArgumentException("Nome deve ter no máximo 100 caracteres");
        }
    }

    private void validarEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email não pode ser vazio");
        }
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        if (!email.matches(emailRegex)) {
            throw new IllegalArgumentException("Email inválido");
        }
    }

    private void validarTelefone(String telefone) {
        if (telefone == null || telefone.isBlank()) {
            throw new IllegalArgumentException("Telefone não pode ser vazio");
        }
        String telefoneNumeros = telefone.replaceAll("[^0-9]", "");
        if (telefoneNumeros.length() < 10 || telefoneNumeros.length() > 11) {
            throw new IllegalArgumentException("Telefone deve ter 10 ou 11 dígitos");
        }
    }

    public void validarSenha(String senha) {
        if (senha == null || this.senha.isBlank()) {
            throw new IllegalArgumentException("A senha é obrigatória.");
        }

        if (senha.length() < MIN_PASSWORD_LENGTH) {
            throw new IllegalArgumentException("A senha deve ter no mínimo " + MIN_PASSWORD_LENGTH + " caracteres.");
        }

        if (!senha.matches(".*[a-z].*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos uma letra minúscula.");
        }

        if (!senha.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos uma letra maiúscula.");
        }

        if (!senha.matches(".*[0-9].*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos um número.");
        }
    }
}