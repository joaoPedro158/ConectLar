package br.ifrn.conectlar.Security;

import br.ifrn.conectlar.Controller.Rotas.RotasBases;
import br.ifrn.conectlar.Controller.Rotas.RotasPrincipais;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    @Autowired
    SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize

                        .requestMatchers("/", "/login", "/app/**").permitAll()
                        .requestMatchers(
                                "/index.html",
                                "/painel-cliente.html",
                                "/feed-trabalhador.html",
                                "/historico_cliente.html",
                                "/perfil.html",
                                "/perfil_cliente.html",
                                "/perfil_trabalhador.html",
                                "/adm.html"
                        ).permitAll()
                        .requestMatchers("/js/**", "/css/**", "/assets/**", "/upload/**", "/uploads/**", "/script.js").permitAll()
                        .requestMatchers("/favicon.ico").permitAll()


                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuario/cadastrar").permitAll()      // Criar conta de usuário
                        .requestMatchers(HttpMethod.POST, "/profissional/cadastrar").permitAll() // Criar conta de profissional
                        .requestMatchers(HttpMethod.POST, RotasPrincipais.RootTrabalho + RotasBases.Cadastra,
                                RotasPrincipais.RootTrabalho + RotasBases.concluirTrabalho).authenticated()


                        .requestMatchers(HttpMethod.GET, RotasPrincipais.RootTrabalho + RotasBases.Lista).permitAll()
                        .requestMatchers(HttpMethod.GET, RotasPrincipais.RootTrabalho + RotasBases.PorId).permitAll()
                        .requestMatchers(HttpMethod.GET, RotasPrincipais.RootTrabalho + RotasBases.Busca).permitAll()
                        .requestMatchers(HttpMethod.GET, RotasPrincipais.RootTrabalho + RotasBases.filtroCategoria).permitAll()
                        .requestMatchers(HttpMethod.GET, RotasPrincipais.RootProfissional + RotasBases.dadosProfissional).authenticated()




                        .requestMatchers(HttpMethod.GET, "/trabalho/list").permitAll()
                        .requestMatchers(HttpMethod.GET, "/trabalho/{id}").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/adm/**").hasRole("ADM")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:8182", "*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}