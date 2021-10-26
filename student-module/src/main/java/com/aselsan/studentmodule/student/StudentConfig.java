package com.aselsan.studentmodule.student;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "ata-service")
public class StudentConfig {

    private int userNumber;

    @Bean
    CommandLineRunner commandLineRunner(StudentRepository repository) {
        List<Student> users = new ArrayList<>();
        return args -> {
            for (int i = 1; i <= getUserNumber(); i++) {
                Student student = new Student(
                        (long) i,
                        "Ahmet",
                        "asungur"+i+"@aselsan.com.tr",
                        LocalDate.of(1993+i, Month.JANUARY, 15));
                users.add(student);
            }
            repository.saveAll(users);
        };
    }

    public int getUserNumber() {
        return userNumber;
    }

    public void setUserNumber(int userNumber) {
        this.userNumber = userNumber;
    }
}
