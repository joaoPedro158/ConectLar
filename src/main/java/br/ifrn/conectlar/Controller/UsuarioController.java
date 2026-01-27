package br.ifrn.conectlar.Controller;

import br.ifrn.conectlar.Controller.Rotas.RotasPrincipais;
import br.ifrn.conectlar.Controller.Rotas.RotasBases;
import br.ifrn.conectlar.Model.dto.TrabalhoDTO;
import br.ifrn.conectlar.Model.dto.UsuarioDTO;
import br.ifrn.conectlar.Security.UsuarioDetails;
import br.ifrn.conectlar.Service.UsuarioService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import br.ifrn.conectlar.Model.dto.UsuarioRecord;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;


@RestController
@RequestMapping(RotasPrincipais.RootUsuario)
@AllArgsConstructor
public class UsuarioController {

    @Autowired
    private final UsuarioService usuarioService;

    @PostMapping( value = RotasBases.Cadastra,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity saveUsuario(@RequestPart("dados") @Valid UsuarioRecord usuario, @RequestPart(value = "arquivo", required = false)MultipartFile arquivo){
        UsuarioDTO novoUsuario = usuarioService.saveUsuario(usuario, arquivo);
        return ResponseEntity.ok(novoUsuario);
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

    @PutMapping(value =RotasBases.Atualiza,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity updateUsuario(@AuthenticationPrincipal UsuarioDetails user,
                                        @RequestPart(value ="dados", required = false)  UsuarioRecord usuario,
                                        @RequestPart(value = "arquivo", required = false )MultipartFile arquivo){
        Long usuarioId = user.getId();
        UsuarioDTO usuarioAtualizado = usuarioService.updateUsuario(usuarioId,usuario,arquivo);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @GetMapping(RotasBases.historico)
    public  ResponseEntity getHistoricoUsuario(@AuthenticationPrincipal UsuarioDetails user){
        Long usuarioId = user.getId();
        List<TrabalhoDTO> historico = usuarioService.historico(usuarioId);
        return ResponseEntity.ok(historico);
    }

    @GetMapping(RotasBases.gastoTotal)
    public ResponseEntity getGastoTotal(@AuthenticationPrincipal UsuarioDetails user){
        Long usuarioId = user.getId();
        BigDecimal total = usuarioService.getGastoTotal(usuarioId);
        return ResponseEntity.ok(total);
    }

    @GetMapping(RotasBases.meudados)
    public  ResponseEntity getMeudados(@AuthenticationPrincipal UsuarioDetails user){
        Long usuarioId = user.getId();
        UsuarioDTO usuarioDTO = usuarioService.getUsuario(usuarioId);
        return  ResponseEntity.ok(usuarioDTO);

    }

}
