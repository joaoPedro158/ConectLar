package br.ifrn.conectlar.Model.Enum;

public enum StatusTrabalho {
    ABERTO("aberto"),
    EM_ANDAMENTO("em_andamento"),
    CONCLUIDO("concluido"),
    CANCELADO("cancelado");
    private String status;
    StatusTrabalho(String status) {
        this.status = status;

    }

    public String getStatus() {
        return status;
    }
}
