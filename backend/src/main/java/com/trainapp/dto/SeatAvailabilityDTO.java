package com.trainapp.dto;

import java.util.List;

public class SeatAvailabilityDTO {
    private Long trainId;
    private String trainName;
    private int totalSeats;
    private int availableSeats;
    private int bookedSeats;
    private List<String> bookedSeatNumbers;
    private List<String> availableSeatNumbers;

    public SeatAvailabilityDTO() {}

    public Long getTrainId() { return trainId; }
    public void setTrainId(Long trainId) { this.trainId = trainId; }
    public String getTrainName() { return trainName; }
    public void setTrainName(String trainName) { this.trainName = trainName; }
    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }
    public int getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(int availableSeats) { this.availableSeats = availableSeats; }
    public int getBookedSeats() { return bookedSeats; }
    public void setBookedSeats(int bookedSeats) { this.bookedSeats = bookedSeats; }
    public List<String> getBookedSeatNumbers() { return bookedSeatNumbers; }
    public void setBookedSeatNumbers(List<String> bookedSeatNumbers) { this.bookedSeatNumbers = bookedSeatNumbers; }
    public List<String> getAvailableSeatNumbers() { return availableSeatNumbers; }
    public void setAvailableSeatNumbers(List<String> availableSeatNumbers) { this.availableSeatNumbers = availableSeatNumbers; }
}
