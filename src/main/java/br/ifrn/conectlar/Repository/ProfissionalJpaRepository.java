package br.ifrn.conectlar.Repository;

import br.ifrn.conectlar.Model.Entity.ProfissionalEntity;
import br.ifrn.conectlar.Model.Entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfissionalJpaRepository extends JpaRepository<ProfissionalEntity, Long> {
    boolean existsByNome(String nome);
    boolean existsByEmail(String email);
    boolean existsByTelefone(String telefone);
    boolean existsByLocalizacao(String localizacao);


    Optional<ProfissionalEntity> findByEmailAndIdNot(String email, Long id);

    Optional<ProfissionalEntity> findByTelefoneAndIdNot(String telefone, Long id);
}
