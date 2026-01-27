package br.ifrn.conectlar.Repository;

import br.ifrn.conectlar.Repository.Entity.AvaliacaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AvaliacaoJparepository extends JpaRepository<AvaliacaoEntity, Long> {

    boolean existsByTrabalhoId(Long idTrabalho);
}
