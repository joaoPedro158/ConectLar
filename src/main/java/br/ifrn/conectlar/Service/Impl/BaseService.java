package br.ifrn.conectlar.Service.Impl;

import br.ifrn.conectlar.Model.Interface.PerfilEntity;
import br.ifrn.conectlar.Model.Interface.PerfilModel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.function.BiFunction;
import java.util.function.Consumer;


@AllArgsConstructor
@NoArgsConstructor
public abstract class BaseService {
    @Autowired
    private  PasswordEncoder passwordEncoder;


    public  <M extends PerfilModel, E extends PerfilEntity> void validarEAtualizar(
            Long id,
            String novoNome,
            String novoEmail,
            String novoTelefone,
            String novaSenha,
            M model,
            E entity,
            BiFunction<String, Long, Boolean> emailExistsCheck,
            BiFunction<String, Long, Boolean> telefoneExistsCheck,
            Consumer<M> mapperAction
    ) {

        if (novoEmail != null && !novoEmail.equals(model.getEmail())) {
            if (emailExistsCheck.apply(novoEmail, id)) {
                throw new IllegalArgumentException("Este e-mail já está em uso.");
            }
        }

        if (novoTelefone != null && !novoTelefone.equals(model.getTelefone())) {
            if (telefoneExistsCheck.apply(novoTelefone, id)) {
                throw new IllegalArgumentException("Este telefone já está em uso.");
            }
        }


        if (novaSenha != null && !novaSenha.isBlank()) {
            model.validarSenha(novaSenha);
            entity.setSenha(passwordEncoder.encode(novaSenha));
        }

        // 4. Atualização e Mapeamento
        model.atualizarDados(novoNome, novoEmail, novoTelefone);
        mapperAction.accept(model);
    }
}
