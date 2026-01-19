package br.ifrn.conectlar.Repository;

import br.ifrn.conectlar.Model.Entity.TrabalhoEntity;
import br.ifrn.conectlar.Model.Enum.StatusTrabalho;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TrabalhoJpaRepository extends JpaRepository<TrabalhoEntity, Long> {

  List<TrabalhoEntity> findByUsuarioIdOrderByDataHoraAbertaDesc(Long id);
  List<TrabalhoEntity> findByStatusOrderByDataHoraAbertaDesc(StatusTrabalho status);
  List<TrabalhoEntity> findByProfissionalIdOrderByDataHoraAbertaDesc(Long id);

  Optional<TrabalhoEntity> findById(Long id);

}
