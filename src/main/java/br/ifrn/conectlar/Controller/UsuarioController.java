package br.ifrn.conectlar.Controller;

import br.ifrn.conectlar.Controller.RotasUsuario.Rotas;
import br.ifrn.conectlar.Controller.RotasUsuario.RotasBases;
import br.ifrn.conectlar.Model.dto.UsuarioDTO;
import br.ifrn.conectlar.Service.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import br.ifrn.conectlar.Model.dto.UsuarioRecord;

import java.util.List;


@RestController
@RequestMapping(Rotas.ROOT)
@AllArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

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
}
