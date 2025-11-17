package br.ifrn.conectlar.Controller;

import br.ifrn.conectlar.Controller.Rotas.RotasBases;
import br.ifrn.conectlar.Controller.Rotas.RotasPrincipais;
import br.ifrn.conectlar.Model.dto.TrabalhoDTO;
import br.ifrn.conectlar.Model.dto.TrabalhoRecord;
import br.ifrn.conectlar.Model.dto.UsuarioDTO;
import br.ifrn.conectlar.Model.dto.UsuarioRecord;
import br.ifrn.conectlar.Service.TrabalhoService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(RotasPrincipais.RootTrabalho)
public class TrabalhoController {

    private final TrabalhoService trabalhoService;

    @PostMapping(value = RotasBases.Cadastra,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity saveTrabalho(@RequestBody TrabalhoRecord trabalho){
        return ResponseEntity.ok(trabalhoService.save(trabalho));
    }

    @GetMapping(RotasBases.Lista)
    public  ResponseEntity getTrabalhos(){
        List<TrabalhoDTO> trabalhos = trabalhoService.getAll();
        return ResponseEntity.ok(trabalhos);
    }
}
