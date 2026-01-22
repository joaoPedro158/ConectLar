package br.ifrn.conectlar.Configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Tudo que vier na URL com /imagens/** vai buscar na pasta uploads/ do disco
        registry.addResourceHandler("/imagens/**")
                .addResourceLocations("file:uploads/");
    }
}
