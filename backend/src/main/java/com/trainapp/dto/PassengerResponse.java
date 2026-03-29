package com.trainapp.dto;

public class PassengerResponse {
    private Long id;
    private String name;
    private Integer age;
    private String gender;
    private String seatNumber;

    public PassengerResponse() {}

    public PassengerResponse(Long id, String name, Integer age, String gender, String seatNumber) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.seatNumber = seatNumber;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
}
