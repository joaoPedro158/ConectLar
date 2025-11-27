package br.ifrn.conectlar.Repository;

import br.ifrn.conectlar.Model.Entity.AdmEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdmJpaRepository extends JpaRepository<AdmEntity, Long> {

}
