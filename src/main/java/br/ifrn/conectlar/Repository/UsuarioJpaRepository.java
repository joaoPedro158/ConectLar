package br.ifrn.conectlar.Repository;

import br.ifrn.conectlar.Model.Entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public interface UsuarioJpaRepository extends JpaRepository<UsuarioEntity, Long> {
    boolean existsByNome(String nome);
    boolean existsByEmail(String email);
    boolean existsByTelefone(String telefone);
    boolean existsById(Long id);

    Optional<UsuarioEntity> findByEmail(String email);
    Optional<UsuarioEntity> findByEmailAndIdNot(String email, Long id);

    Optional<UsuarioEntity> findByTelefoneAndIdNot(String telefone, Long id);


}
