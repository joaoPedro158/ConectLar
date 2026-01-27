package br.ifrn.conectlar.Repository;

import br.ifrn.conectlar.Model.Entity.AvaliacaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AvaliacaoJparepository extends JpaRepository<AvaliacaoEntity, Long> {

    boolean existsByTrabalhoId(Long idTrabalho);
}
