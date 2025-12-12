package com.hr_management.hr_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HrManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(HrManagementSystemApplication.class, args);
	}

}
