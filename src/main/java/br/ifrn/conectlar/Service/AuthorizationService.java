package br.ifrn.conectlar.Service;

import br.ifrn.conectlar.Repository.ProfissionalJpaRepository;
import br.ifrn.conectlar.Repository.UsuarioJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService implements UserDetailsService {
    @Autowired
    UsuarioJpaRepository usuarioJpaRepository;
    @Autowired
    ProfissionalJpaRepository profissionalJpaRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        var usuario = usuarioJpaRepository.findByEmail(username);
        if (usuario.isPresent()) {
            return usuario.get();
        }

        var profissional = profissionalJpaRepository.findByEmail(username);
        if (profissional.isPresent()) {
            return profissional.get();
        }

        throw new UsernameNotFoundException("usuario nao encontrado na classe authorizerService");
    }
}
