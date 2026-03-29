package com.trainapp.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public class TrainRequest {
    @NotBlank(message = "Train number is required")
    private String trainNumber;

    @NotBlank(message = "Train name is required")
    private String trainName;

    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotNull(message = "Total seats required")
    @Min(value = 1, message = "Seats must be positive")
    private Integer totalSeats;

    @NotNull(message = "Base fare required")
    @Min(value = 1, message = "Fare must be positive")
    private Double baseFare;

    @NotBlank(message = "Departure time is required")
    private String departureTime;

    @NotBlank(message = "Arrival time is required")
    private String arrivalTime;

    @NotBlank(message = "Date is required")
    private String date;

    @Valid
    private List<StationRequest> stations;

    public TrainRequest() {}

    public String getTrainNumber() { return trainNumber; }
    public void setTrainNumber(String trainNumber) { this.trainNumber = trainNumber; }
    public String getTrainName() { return trainName; }
    public void setTrainName(String trainName) { this.trainName = trainName; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }
    public Double getBaseFare() { return baseFare; }
    public void setBaseFare(Double baseFare) { this.baseFare = baseFare; }
    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public List<StationRequest> getStations() { return stations; }
    public void setStations(List<StationRequest> stations) { this.stations = stations; }
}
