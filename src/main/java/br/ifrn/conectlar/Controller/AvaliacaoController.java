package br.ifrn.conectlar.Controller;

import br.ifrn.conectlar.Controller.Rotas.RotasBases;
import br.ifrn.conectlar.Controller.Rotas.RotasPrincipais;
import br.ifrn.conectlar.Model.dto.AvaliacaoDTO;
import br.ifrn.conectlar.Model.dto.AvaliacaoRecord;
import br.ifrn.conectlar.Service.AvaliacaoService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping(RotasPrincipais.Avaliacao)
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    @PostMapping(RotasBases.avaliar)
    public ResponseEntity avaliar(@PathVariable Long idTrabalho,
                                  @RequestBody AvaliacaoRecord avaliacaoRecord) {
        AvaliacaoDTO avaliacao = avaliacaoService.avaliar(avaliacaoRecord,  idTrabalho);
        return ResponseEntity.ok(avaliacao);
    }
}
