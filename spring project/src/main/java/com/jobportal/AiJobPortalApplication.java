package com.jobportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AiJobPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiJobPortalApplication.class, args);
        System.out.println("\n=======================================================");
        System.out.println("  AI Job Portal System running on http://localhost:8080");
        System.out.println("  H2 Database Console: http://localhost:8080/h2-console");
        System.out.println("  Default demo account password: 12345");
        System.out.println("=======================================================\n");
    }
}
