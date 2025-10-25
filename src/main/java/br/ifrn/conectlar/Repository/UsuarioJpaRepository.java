package br.ifrn.conectlar.Repository;

import br.ifrn.conectlar.Model.Entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioJpaRepository extends JpaRepository<UsuarioEntity, Long> {
    boolean existsByNome(String nome);
    boolean existsByEmail(String email);
    boolean existsByTelefone(String telefone);
    boolean existsByLocalizacao(String localizacao);

    /** Verifica se o email existe em um usuário com ID diferente */
    Optional<UsuarioEntity> findByEmailAndIdNot(String email, Long id);

    /** Verifica se o login existe em um usuário com ID diferente */
    Optional<UsuarioEntity> findByLoginAndIdNot(String login, Long id);

    /** Verifica se o telefone existe em um usuário com ID diferente */
    Optional<UsuarioEntity> findByTelefoneAndIdNot(String telefone, Long id);


}
