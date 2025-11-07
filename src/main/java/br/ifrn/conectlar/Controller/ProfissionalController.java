package br.ifrn.conectlar.Controller;

import br.ifrn.conectlar.Controller.Rotas.RotasBases;
import br.ifrn.conectlar.Controller.Rotas.RotasPrincipais;
import br.ifrn.conectlar.Model.dto.ProfissionalRecord;
import br.ifrn.conectlar.Service.ProfissionalService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping(RotasPrincipais.RootProfissional)
public class ProfissionalController {

    private final ProfissionalService profissionalService;

    @PostMapping(value = RotasBases.Cadastra,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity saveProfissional(@RequestBody ProfissionalRecord profissional){
        return ResponseEntity.ok(profissionalService.saveProfissional(profissional));
    }

    @GetMapping(value = RotasBases.Lista,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity getProfissionais(){
        return ResponseEntity.ok(profissionalService.getAll());
    }
}
