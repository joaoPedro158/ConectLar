package br.ifrn.conectlar.Controller;

import br.ifrn.conectlar.Controller.Rotas.RotasBases;
import br.ifrn.conectlar.Controller.Rotas.RotasPrincipais;
import br.ifrn.conectlar.Model.Entity.BaseAuthEntity;
import br.ifrn.conectlar.Model.Localizacao;
import br.ifrn.conectlar.Model.dto.AutenticacaoRecord;
import br.ifrn.conectlar.Model.dto.LocalizacaoDTO;
import br.ifrn.conectlar.Model.dto.LoginResponseRecord;
import br.ifrn.conectlar.Model.dto.MeResponse;
import br.ifrn.conectlar.Repository.AdmJpaRepository;
import br.ifrn.conectlar.Repository.ProfissionalJpaRepository;
import br.ifrn.conectlar.Repository.UsuarioJpaRepository;
import br.ifrn.conectlar.Service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(RotasPrincipais.Auth)
public class AutenticacaoController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioJpaRepository usuarioRepository;

    @Autowired
    private ProfissionalJpaRepository profissionalRepository;

    @Autowired
    private AdmJpaRepository admRepository;

    @Autowired
    private TokenService tokenService;

    @PostMapping(RotasBases.Login)
    public ResponseEntity<?> login(@RequestBody @Valid AutenticacaoRecord dadosRecord) {
        var usuarioSenha = new UsernamePasswordAuthenticationToken(dadosRecord.login(), dadosRecord.senha());
        var auth = this.authenticationManager.authenticate(usuarioSenha);

        var token = tokenService.gerarToken((BaseAuthEntity) auth.getPrincipal());
        return ResponseEntity.ok(new LoginResponseRecord(token));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Não autenticado");
        }

        String email = authentication.getName();

        var usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isPresent()) {
            return ResponseEntity.ok(toMeResponse(usuarioOpt.get()));
        }

        var profOpt = profissionalRepository.findByEmail(email);
        if (profOpt.isPresent()) {
            return ResponseEntity.ok(toMeResponse(profOpt.get()));
        }

        var admOpt = admRepository.findByEmail(email);
        if (admOpt.isPresent()) {
            return ResponseEntity.ok(toMeResponse(admOpt.get()));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
    }

    private MeResponse toMeResponse(BaseAuthEntity auth) {
        LocalizacaoDTO locDto = null;

        String telefone = null;
        try {
            telefone = (String) auth.getClass().getMethod("getTelefone").invoke(auth);
        } catch (Exception ignored) {}

        try {
            var loc = (Localizacao) auth.getClass().getMethod("getLocalizacao").invoke(auth);
            if (loc != null) {
                locDto = new LocalizacaoDTO(
                        loc.getRua(),
                        loc.getBairro(),
                        loc.getNumero(),
                        loc.getCidade(),
                        loc.getCep(),
                        loc.getEstado(),
                        loc.getComplemento()
                );
            }
        } catch (Exception ignored) {}

        return new MeResponse(
                auth.getId(),
                auth.getNome(),
                auth.getEmail(),
                telefone,
                auth.getRole(),
                locDto
        );
    }
}
