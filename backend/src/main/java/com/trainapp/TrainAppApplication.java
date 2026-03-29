package com.trainapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TrainAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(TrainAppApplication.class, args);
    }
}
