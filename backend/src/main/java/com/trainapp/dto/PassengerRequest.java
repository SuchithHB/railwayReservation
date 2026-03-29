package com.trainapp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PassengerRequest {
    @NotBlank(message = "Passenger name is required")
    private String name;

    @NotNull(message = "Age is required")
    @Min(value = 1, message = "Age must be positive")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    public PassengerRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
}
