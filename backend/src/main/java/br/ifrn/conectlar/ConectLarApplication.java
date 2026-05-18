package br.ifrn.conectlar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "br.ifrn.conectlar.Repository")
public class ConectLarApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConectLarApplication.class, args);
    }

}
