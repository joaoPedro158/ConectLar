package br.ifrn.conectlar.Model.Enum;

public enum UsuarioRole {
    ADM("adm"),
    PROFISSIONAL("profissional"),
    USUARIO("usuario");

    private String role;

    UsuarioRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}