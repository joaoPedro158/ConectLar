package br.ifrn.conectlar.Controller.Rotas;

public interface RotasBases {

    String Delete = "/delete/{id}";

    String Cadastra = "/form";

    String Lista = "/list";

    String Atualiza = "/update";

    String PorId = "/{id}";

    String Login = "/login";

    String historico = "/historico";

    String candidatar = "/{id}/candidatar";

    String Busca = "/busca";
<<<<<<< Updated upstream
=======
    String filtroCategoria = "/filtro/categoria";
>>>>>>> Stashed changes

    String avaliar = "/avaliar/{idTrabalho}";
}