package br.ifrn.conectlar.Controller;

import br.ifrn.conectlar.Controller.Rotas.RotasBases;
import br.ifrn.conectlar.Controller.Rotas.RotasPrincipais;
import br.ifrn.conectlar.Model.Enum.UsuarioRole;
import br.ifrn.conectlar.Model.Localizacao;
import br.ifrn.conectlar.Model.dto.LocalizacaoDTO;
import br.ifrn.conectlar.Model.dto.Record.LocalizacaoRecord;
import br.ifrn.conectlar.Security.UsuarioDetails;
import br.ifrn.conectlar.Service.LocalizacaoService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(RotasPrincipais.Localizacao)
@AllArgsConstructor
public class LocalizacaoController {

    private LocalizacaoService localizacaoService;
    @PostMapping(RotasBases.Cadastra)
    public ResponseEntity cadastraLocalizacao(@AuthenticationPrincipal UsuarioDetails user, @RequestBody LocalizacaoRecord localizacao) {
        Long id = user.getId();
        UsuarioRole role = user.getRole();
        LocalizacaoDTO localizacaoDto = localizacaoService.cadastralocalizacao(localizacao,role,id);
        return ResponseEntity.ok().body(localizacaoDto);
    }

    @GetMapping(RotasBases.Lista)
    public ResponseEntity listaLocalizacao(@AuthenticationPrincipal UsuarioDetails user) {
        Long id = user.getId();
        UsuarioRole role = user.getRole();
        List<LocalizacaoDTO> listaLocalizacao = localizacaoService.listaLocalizacao(role,id);
        return ResponseEntity.ok().body(listaLocalizacao);
    }

}
