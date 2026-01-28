package br.ifrn.conectlar.Repository;

import br.ifrn.conectlar.Repository.Entity.ProfissionalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfissionalJpaRepository extends JpaRepository<ProfissionalEntity, Long> {
    boolean existsByNome(String nome);
    boolean existsByEmail(String email);
    boolean existsByTelefone(String telefone);


    Optional<ProfissionalEntity> findByEmailAndIdNot(String email, Long id);
    Optional<ProfissionalEntity> findByEmail(String email);

    Optional<ProfissionalEntity> findByTelefoneAndIdNot(String telefone, Long id);
}
