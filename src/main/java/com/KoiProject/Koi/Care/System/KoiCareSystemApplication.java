package com.KoiProject.Koi.Care.System;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class KoiCareSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(KoiCareSystemApplication.class, args);
	}

}
