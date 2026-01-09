package br.ifrn.conectlar.Model.Entity;


import br.ifrn.conectlar.Model.Localizacao;
import jakarta.persistence.*;
        import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
public abstract class BaseUsuarioEntity extends BaseAuthEntity {


    @Embedded
    private Localizacao localizacao;

    @Column(length = 150, nullable = false, unique = true)
    private String telefone;


}
