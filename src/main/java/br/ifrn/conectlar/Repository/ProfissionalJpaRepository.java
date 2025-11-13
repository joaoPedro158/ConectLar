package br.ifrn.conectlar.Repository;

import br.ifrn.conectlar.Model.Entity.ProfissionalEntity;
import br.ifrn.conectlar.Model.Entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfissionalJpaRepository extends JpaRepository<ProfissionalEntity, Long> {
    boolean existsByNome(String nome);
    boolean existsByEmail(String email);
    boolean existsByTelefone(String telefone);
    boolean existsByLocalizacao(String localizacao);
    boolean existsByLogin(String login);
    boolean existsByFuncao(String funcao);


    Optional<UsuarioEntity> findByEmailAndIdNot(String email, Long id);

    Optional<UsuarioEntity> findByLoginAndIdNot(String login, Long id);

    Optional<UsuarioEntity> findByTelefoneAndIdNot(String telefone, Long id);
}
