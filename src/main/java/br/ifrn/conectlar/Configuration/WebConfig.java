package br.ifrn.conectlar.Configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        
        registry.addViewController("/").setViewName("forward:/index.html");

        
        registry.addViewController("/login").setViewName("forward:/index.html");

        
        registry.addViewController("/app/cliente").setViewName("forward:/painel-cliente.html");

        
        registry.addViewController("/app/profissional").setViewName("forward:/feed-trabalhador.html");
    }

    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/upload/**")
                .addResourceLocations("file:./upload/"); 
    }
}