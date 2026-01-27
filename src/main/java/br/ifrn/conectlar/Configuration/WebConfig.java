package br.ifrn.conectlar.Configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:8181", "http://127.0.0.1:5500", "*") // Ajuste conforme seu front
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // mapeia a URL /uploads/** para a pasta física upload/ na raiz do projeto
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:upload/");
    }
}