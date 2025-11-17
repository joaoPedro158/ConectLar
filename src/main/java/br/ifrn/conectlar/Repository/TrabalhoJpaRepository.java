package br.ifrn.conectlar.Repository;

import br.ifrn.conectlar.Model.Entity.TrabalhoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrabalhoJpaRepository extends JpaRepository<TrabalhoEntity, Long> {
    boolean existsById(Long aLong);
}
