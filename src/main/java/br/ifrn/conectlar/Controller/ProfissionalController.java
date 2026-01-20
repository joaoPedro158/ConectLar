package br.ifrn.conectlar.Controller;

import br.ifrn.conectlar.Controller.Rotas.RotasBases;
import br.ifrn.conectlar.Controller.Rotas.RotasPrincipais;
import br.ifrn.conectlar.Model.dto.ProfissionalRecord;
import br.ifrn.conectlar.Model.dto.TrabalhoDTO;
import br.ifrn.conectlar.Security.UsuarioDetails;
import br.ifrn.conectlar.Service.ProfissionalService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @DeleteMapping(value = RotasBases.Delete)
    public ResponseEntity deleteProfissional(@PathVariable Long id){
        profissionalService.deleteProfissional(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping(RotasBases.Atualiza)
    public ResponseEntity updateProfissional(@AuthenticationPrincipal UsuarioDetails user, @RequestBody ProfissionalRecord profissionalRecord){
        Long profissionalId = user.getId();
        return ResponseEntity.ok(profissionalService.updateProfissional(profissionalId, profissionalRecord));
    }

    @GetMapping(RotasBases.historico)
    public ResponseEntity getHistoricoProfissional(@AuthenticationPrincipal UsuarioDetails user){
        Long profissionalId = user.getId();
        List<TrabalhoDTO> historico = profissionalService.historico(profissionalId);
        return ResponseEntity.ok(historico);
    }
}
