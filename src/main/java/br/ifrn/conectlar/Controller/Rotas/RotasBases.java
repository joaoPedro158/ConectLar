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
    String aceitarCandidato= "{idTrabalho}/responder";
    String cancelarTrabalho = "{idTrabalho}/cancelar";
    String concluirTrabalho = "/{idTrabalho}/concluir";

    String Busca = "/busca";


    String avaliar = "/avaliar/{idTrabalho}";
}