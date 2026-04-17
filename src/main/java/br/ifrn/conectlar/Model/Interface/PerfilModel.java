package br.ifrn.conectlar.Model.Interface;

public interface PerfilModel {
    String getEmail();
    String getTelefone();
    void validarSenha(String senha);
    void atualizarDados(String nome,String email,String telefone);
}
