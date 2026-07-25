package br.com.foztalentos.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    // Registra as metainformações exibidas no Swagger UI
    @Bean
    public OpenAPI customOpenAPI() {

        return new OpenAPI().info(new Info().title("Foz Talentos API").version("1.0").description(
                              """
                              API responsável pelo gerenciamento de:
                              - Administradores
                                - Categorias
                                - Vagas
                                - Autenticação JWT
                                """)
                .contact(new Contact().name("Equipe Foz Talentos").email("contato@foztalentos.com"))
                .license(new License().name("MIT")));

    }

}