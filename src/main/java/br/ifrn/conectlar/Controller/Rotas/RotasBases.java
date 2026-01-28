package br.ifrn.conectlar.Controller.Rotas;

public interface RotasBases {

    String Delete = "/delete/{id}";

    String Cadastra = "/cadastrar";

    String Lista = "/list";

    String Atualiza = "/update";

    String PorId = "/{id}";

    String Login = "/login";

    String historico = "/historico";

    String candidatar = "/{id}/candidatar";

    String aceitarCandidato= "/{idTrabalho}/responder"; // <--- Adiciona a barra
    String cancelarTrabalho = "/{idTrabalho}/cancelar"; // <--- Adiciona a barra
    String concluirTrabalho = "/{idTrabalho}/concluir";

    String Busca = "/busca";



    String filtroCategoria = "/filtro/categoria";

    String  gastoTotal = "/gastoTotal";
    String meudados = "/meusdados";

    String avaliar = "/avaliar/{idTrabalho}";
}