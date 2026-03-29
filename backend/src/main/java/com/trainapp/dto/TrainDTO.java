package com.trainapp.dto;

import java.time.LocalTime;
import java.util.List;

public class TrainDTO {
    private Long id;
    private String trainNumber;
    private String trainName;
    private String source;
    private String destination;
    private Integer totalSeats;
    private Integer availableSeats;
    private Double baseFare;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private String date;
    private List<StationDTO> stations;

    public TrainDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
    public Double getBaseFare() { return baseFare; }
    public void setBaseFare(Double baseFare) { this.baseFare = baseFare; }
    public LocalTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }
    public LocalTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public List<StationDTO> getStations() { return stations; }
    public void setStations(List<StationDTO> stations) { this.stations = stations; }
}
