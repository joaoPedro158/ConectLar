package br.ifrn.conectlar.Controller;

import br.ifrn.conectlar.Controller.Rotas.RotasPrincipais;
import br.ifrn.conectlar.Controller.Rotas.RotasBases;
import br.ifrn.conectlar.Model.dto.TrabalhoDTO;
import br.ifrn.conectlar.Model.dto.UsuarioDTO;
import br.ifrn.conectlar.Security.UsuarioDetails;
import br.ifrn.conectlar.Service.ProfissionalService;
import br.ifrn.conectlar.Service.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import br.ifrn.conectlar.Model.dto.UsuarioRecord;

import java.util.List;


@RestController
@RequestMapping(RotasPrincipais.RootUsuario)
@AllArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final ProfissionalService profissionalService;

    @PostMapping( value = RotasBases.Cadastra,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity saveUsuario(@RequestBody UsuarioRecord usuario){
        return ResponseEntity.ok(usuarioService.saveUsuario(usuario));
    }

    @GetMapping(RotasBases.Lista)
    public  ResponseEntity getUsuarios(){
        List<UsuarioDTO> usuarios = usuarioService.getAll();
        return ResponseEntity.ok(usuarios);
    }

    @DeleteMapping(RotasBases.Delete)
    public ResponseEntity deleteUsuario(@PathVariable Long id){
        usuarioService.deleteUsuario(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping(RotasBases.Atualiza)
    public ResponseEntity updateUsuario(@AuthenticationPrincipal UsuarioDetails user, @RequestBody UsuarioRecord usuario){
        Long usuarioId = user.getId();
        return ResponseEntity.ok(usuarioService.updateUsuario(usuarioId, usuario));
    }

    @GetMapping(RotasBases.historico)
    public  ResponseEntity getHistoricoUsuario(@AuthenticationPrincipal UsuarioDetails user){
        Long usuarioId = user.getId();
        List<TrabalhoDTO> historico = usuarioService.historico(usuarioId);
        return ResponseEntity.ok(historico);
    }
}
