package com.swpproject.koi_care_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync(proxyTargetClass = true)
public class KoiCareSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(KoiCareSystemApplication.class, args);
	}

}
