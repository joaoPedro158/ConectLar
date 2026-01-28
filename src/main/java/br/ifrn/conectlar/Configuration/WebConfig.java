package br.ifrn.conectlar.Configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // redireciona a raiz para o index.html
        registry.addViewController("/").setViewName("forward:/index.html");

        // cria uma rota /login que também abre o index
        registry.addViewController("/login").setViewName("forward:/index.html");

        // rota limpa para o painel do cliente
        registry.addViewController("/app/cliente").setViewName("forward:/painel-cliente.html");

        // rota limpa para o painel do profissional
        registry.addViewController("/app/profissional").setViewName("forward:/feed-trabalhador.html");
    }

    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/upload/**")
                .addResourceLocations("file:./upload/"); // <--- Adicione o PONTO antes da barra
    }
}