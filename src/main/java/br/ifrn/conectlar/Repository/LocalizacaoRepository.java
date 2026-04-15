package br.ifrn.conectlar.Repository;

import br.ifrn.conectlar.Repository.Entity.LocalizacaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocalizacaoRepository extends JpaRepository<LocalizacaoEntity, Long> {

}
