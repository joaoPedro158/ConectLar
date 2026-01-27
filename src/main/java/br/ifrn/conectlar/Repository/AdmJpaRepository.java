package br.ifrn.conectlar.Repository;

import br.ifrn.conectlar.Repository.Entity.AdmEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdmJpaRepository extends JpaRepository<AdmEntity, Long> {
    boolean existsByEmail(String email);
    Optional<AdmEntity> findByEmail(String email);
}
