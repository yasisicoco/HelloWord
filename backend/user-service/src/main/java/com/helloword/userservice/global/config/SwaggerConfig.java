package com.helloword.userservice.global.config;


import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(swaggerInfo())
                .components(new Components());
    }

    private Info swaggerInfo() {
        License license = new License();
        license.setUrl("https://lab.ssafy.com/s11-bigdata-dist-sub1/S11P21B206");
        license.setName("Hello Word");
        return new Info()
                .version("1.0.0")
                .title("\"Hello Word API문서\"")
                .description("유저 API 문서 입니다.")
                .license(license);
    }
}
