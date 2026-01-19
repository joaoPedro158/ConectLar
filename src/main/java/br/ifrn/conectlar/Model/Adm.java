package br.ifrn.conectlar.Model;


import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

import java.util.regex.Pattern;

@SuperBuilder
@Getter
public class Adm {
    private Long id;
    private String nome;
    private String email;
    private String senha;
    private UsuarioRole role;

    // Constantes de Validação (Reaproveitando o padrão de segurança)
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final int MIN_PASSWORD_LENGTH = 8;

    protected Adm(Long id, String nome, String email, String senha, UsuarioRole role) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.role = role;

       validacao();
    }

   public void validacao() {

       if (this.nome == null || this.nome.trim().length() < 3) {
           throw new IllegalArgumentException("O nome do administrador é obrigatório e deve ter pelo menos 3 letras.");
       }

       if (this.email == null || this.email.isBlank()) {
           throw new IllegalArgumentException("O e-mail é obrigatório.");
       }

       if (!EMAIL_PATTERN.matcher(this.email).matches()) {
           throw new IllegalArgumentException("O formato do e-mail é inválido.");
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



       if (this.role == null) {
           throw new IllegalArgumentException("O perfil de acesso (Role) é obrigatório.");
       }

   }
}



