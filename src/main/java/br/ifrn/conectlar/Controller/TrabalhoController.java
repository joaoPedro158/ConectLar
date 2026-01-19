package br.ifrn.conectlar.Controller;

import br.ifrn.conectlar.Controller.Rotas.RotasBases;
import br.ifrn.conectlar.Controller.Rotas.RotasPrincipais;
import br.ifrn.conectlar.Model.dto.TrabalhoDTO;
import br.ifrn.conectlar.Model.dto.TrabalhoRecord;
import br.ifrn.conectlar.Security.UsuarioDetails;
import br.ifrn.conectlar.Service.TrabalhoService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    @PutMapping(RotasBases.Atualiza)
    public ResponseEntity updateTrabalho(@PathVariable Long id, @RequestBody TrabalhoRecord trabalho){
        return ResponseEntity.ok(trabalhoService.update(id, trabalho));
    }

    @GetMapping(RotasBases.PorId)
    public ResponseEntity getTrabalhoById(@PathVariable Long id){
        return ResponseEntity.ok(trabalhoService.findById(id));
    }

    @DeleteMapping(RotasBases.Delete)
    public ResponseEntity deleteTrabalho(@PathVariable Long id){
        trabalhoService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping(RotasBases.candidatar)
    public ResponseEntity candidatar(@PathVariable Long id, @AuthenticationPrincipal UsuarioDetails usuario){
        Long idProfissional = usuario.getId();
        trabalhoService.solicitarTrabalho(id,idProfissional);
        return ResponseEntity.ok().build();
    }

    @GetMapping(RotasBases.Busca)
    public ResponseEntity<List<TrabalhoDTO>> busca(@RequestParam String termo){
        List<TrabalhoDTO> busca = trabalhoService.BuscarProblema(termo);
        return ResponseEntity.ok(busca);
    }
}
