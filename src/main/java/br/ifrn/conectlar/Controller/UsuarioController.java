package br.ifrn.conectlar.Controller;

import br.ifrn.conectlar.Controller.RotasUsuario.Rotas;
import br.ifrn.conectlar.Controller.RotasUsuario.RotasBases;
import br.ifrn.conectlar.Service.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import br.ifrn.conectlar.Model.dto.UsuarioRecord;


@Controller
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
}
