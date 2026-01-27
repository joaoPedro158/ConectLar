package br.ifrn.conectlar.Controller;

import br.ifrn.conectlar.Controller.Rotas.RotasBases;
import br.ifrn.conectlar.Controller.Rotas.RotasPrincipais;
import br.ifrn.conectlar.Model.dto.ProfissionalDTO;
import br.ifrn.conectlar.Model.dto.ProfissionalRecord;
import br.ifrn.conectlar.Model.dto.TrabalhoDTO;
import br.ifrn.conectlar.Security.UsuarioDetails;
import br.ifrn.conectlar.Service.ProfissionalService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(RotasPrincipais.RootProfissional)
public class ProfissionalController {

    private final ProfissionalService profissionalService;

    @PostMapping(value = RotasBases.Cadastra,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity saveProfissional(@RequestPart("dados") ProfissionalRecord profissionalRecord,
                                           @RequestPart(value = "arquivo", required = false)MultipartFile arquivo){
        ProfissionalDTO novoProfissional = profissionalService.saveProfissional(profissionalRecord, arquivo);
        return ResponseEntity.ok().body(novoProfissional);
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
    public ResponseEntity updateProfissional(@AuthenticationPrincipal UsuarioDetails user,
                                             @RequestPart(value = "dados", required = false) ProfissionalRecord profissionalRecord,
                                             @RequestPart(value = "arquivo", required = false)MultipartFile arquivo) {
        Long profissionalId = user.getId();
        ProfissionalDTO profissionalAtualizado = profissionalService.updateProfissional(profissionalId,profissionalRecord,arquivo);
        return ResponseEntity.ok().body(profissionalAtualizado);
    }

    @GetMapping(RotasBases.historico)
    public ResponseEntity getHistoricoProfissional(@AuthenticationPrincipal UsuarioDetails user){
        Long profissionalId = user.getId();
        List<TrabalhoDTO> historico = profissionalService.historico(profissionalId);
        return ResponseEntity.ok(historico);
    }

    @GetMapping(RotasBases.meudados)
    public ResponseEntity getMeusDados(@AuthenticationPrincipal UsuarioDetails user) {
        Long profissionaoId = user.getId();
        ProfissionalDTO profissional = profissionalService.getProfissional(profissionaoId);
        return ResponseEntity.ok(profissional);
    }
}
