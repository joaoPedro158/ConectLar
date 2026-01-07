package br.ifrn.conectlar.Controller;

import br.ifrn.conectlar.Controller.Rotas.RotasBases;
import br.ifrn.conectlar.Controller.Rotas.RotasPrincipais;
import br.ifrn.conectlar.Model.Entity.BaseUsuarioEntity;
import br.ifrn.conectlar.Model.dto.AutenticacaoRecord;
import br.ifrn.conectlar.Model.dto.LoginResponseRecord;
import br.ifrn.conectlar.Service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(RotasPrincipais.Auth)
public class AutenticacaoController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @PostMapping(RotasBases.Login)
    public ResponseEntity login(@RequestBody @Valid AutenticacaoRecord dadosRecord){
        var usuarioSenha = new UsernamePasswordAuthenticationToken(dadosRecord.login(), dadosRecord.senha());
        var auth =this.authenticationManager.authenticate(usuarioSenha);
        var token = tokenService.gerarToken((BaseUsuarioEntity) auth.getPrincipal());
        return  ResponseEntity.ok(new LoginResponseRecord(token));
    }
}
