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
import org.springframework.security.config.Customizer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    @Autowired
    SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(Customizer.withDefaults()) // ✅ ATIVA CORS AQUI
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize

                        .requestMatchers("/", "/index.html", "/static/**", "/assets/**", "/favicon.ico", "/css/**", "/js/**").permitAll()

                        // qualquer usuario tem permissão
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, RotasPrincipais.RootUsuario + RotasBases.Cadastra).permitAll()
                        .requestMatchers(HttpMethod.POST, RotasPrincipais.RootProfissional + RotasBases.Cadastra).permitAll()
                        .requestMatchers(HttpMethod.POST, RotasPrincipais.RootTrabalho + RotasBases.Cadastra).permitAll()
                        .requestMatchers(HttpMethod.GET, RotasPrincipais.RootUsuario + RotasBases.Lista).permitAll()
                        .requestMatchers(HttpMethod.POST, RotasPrincipais.RootAdm + RotasBases.Cadastra).permitAll()
                        .requestMatchers(HttpMethod.PUT, RotasPrincipais.RootTrabalho + RotasBases.Atualiza + "/{id}").permitAll()
                        .requestMatchers("/usuario/form", "/profissional/form").permitAll()
                        .requestMatchers("/auth/me").authenticated()
                        .requestMatchers("/error").permitAll()

                        // somente profissionais
                        .requestMatchers(HttpMethod.PUT, RotasPrincipais.RootProfissional + RotasBases.Atualiza).permitAll()

                        .requestMatchers(RotasPrincipais.RootAdm + "/**").hasRole("ADM")
                        .requestMatchers("/proposta/**").hasRole("PROFISSIONAL")


                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);


        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }



    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
