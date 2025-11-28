package br.ifrn.conectlar.Controller;

import br.ifrn.conectlar.Controller.Rotas.RotasBases;
import br.ifrn.conectlar.Model.dto.AdmDTO;
import br.ifrn.conectlar.Model.dto.AdmRecord;
import br.ifrn.conectlar.Model.dto.TrabalhoRecord;
import br.ifrn.conectlar.Service.AdmService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/adm")
@AllArgsConstructor
public class AdmController {
    final private AdmService admService;

    @GetMapping(RotasBases.Lista)
    public ResponseEntity<List<AdmDTO>> getAll(){
        return ResponseEntity.ok(admService.getAll());
    }

    @PostMapping(value = RotasBases.Cadastra,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity saveAdm(@RequestBody AdmRecord record){
        return ResponseEntity.ok(admService.save(record));
    }

    @GetMapping(RotasBases.PorId)
    public ResponseEntity getAdmById(@PathVariable Long id){
        return ResponseEntity.ok(admService.findById(id));
    }

    @PutMapping(RotasBases.Atualiza)
    public ResponseEntity updateAdm(@PathVariable Long id, @RequestBody AdmRecord record){
        return ResponseEntity.ok(admService.update(id, record));
    }

    @DeleteMapping(RotasBases.Delete)
    public ResponseEntity deleteAdm(@PathVariable Long id){
        admService.delete(id);
        return ResponseEntity.ok().build();
    }

}
