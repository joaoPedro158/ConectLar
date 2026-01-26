package br.ifrn.conectlar.Repository;

import br.ifrn.conectlar.Repository.Entity.TrabalhoEntity;
import br.ifrn.conectlar.Model.Enum.CategoriaEnum;
import br.ifrn.conectlar.Model.Enum.StatusTrabalho;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TrabalhoJpaRepository extends JpaRepository<TrabalhoEntity, Long> {

  List<TrabalhoEntity> findByUsuarioIdOrderByDataHoraAbertaDesc(Long id);
  List<TrabalhoEntity> findByStatusOrderByDataHoraAbertaDesc(StatusTrabalho status);
  List<TrabalhoEntity> findByProfissionalIdOrderByDataHoraAbertaDesc(Long id);
  List<TrabalhoEntity> findByCategoriaOrderByDataHoraAbertaDesc(CategoriaEnum categoria);

  Optional<TrabalhoEntity> findById(Long id);


  List<TrabalhoEntity> findByProblemaContainingIgnoreCaseAndStatusOrderByDataHoraAbertaDesc(String problema, StatusTrabalho status);

    Long id(Long id);
}
