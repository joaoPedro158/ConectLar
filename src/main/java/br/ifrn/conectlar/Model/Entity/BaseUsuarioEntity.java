package br.ifrn.conectlar.Model.Entity;


import jakarta.persistence.*;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;


@MappedSuperclass
@Getter
@Setter

public abstract class BaseUsuarioEntity extends BaseAuthEntity {


    @Column(length = 150, nullable = false)
    private String localizacao;

    @Column(length = 150, nullable = false, unique = true)
    private String telefone;


}
