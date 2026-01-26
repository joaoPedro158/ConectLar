package br.ifrn.conectlar.Repository;

import br.ifrn.conectlar.Repository.Entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioJpaRepository extends JpaRepository<UsuarioEntity, Long> {
    boolean existsByEmail(String email);
    boolean existsByTelefone(String telefone);
    boolean existsById(Long id);

    Optional<UsuarioEntity> findByEmail(String email);
    Optional<UsuarioEntity> findByEmailAndIdNot(String email, Long id);
    Optional<UsuarioEntity> findById(Long id);
    Optional<UsuarioEntity> findByTelefoneAndIdNot(String telefone, Long id);


}
