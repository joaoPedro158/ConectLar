package br.ifrn.conectlar.Model.Enum;

public enum CategoriaEnum {
    ENCANADOR("encanador"),
    ELETRICISTA("eletricista"),
    LIMPEZA("limpeza"),
    PINTOR("pintor"),
    MARCENEIRO("marceneiro"),
    JARDINEIRO("jardineiro"),
    MECANICO("mecanico"),
    GERAL("geral");

    private  String categoria;
    CategoriaEnum(String categoria) {
        this.categoria = categoria;
    }

    public String getCategoria() {return categoria;}

}
