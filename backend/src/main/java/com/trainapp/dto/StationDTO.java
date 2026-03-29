package com.trainapp.dto;

import java.time.LocalTime;

public class StationDTO {
    private Long id;
    private String stationName;
    private LocalTime arrivalTime;
    private LocalTime departureTime;
    private Integer stopNumber;

    public StationDTO() {}

    public StationDTO(Long id, String stationName, LocalTime arrivalTime, LocalTime departureTime, Integer stopNumber) {
        this.id = id;
        this.stationName = stationName;
        this.arrivalTime = arrivalTime;
        this.departureTime = departureTime;
        this.stopNumber = stopNumber;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStationName() { return stationName; }
    public void setStationName(String stationName) { this.stationName = stationName; }
    public LocalTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; }
    public LocalTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }
    public Integer getStopNumber() { return stopNumber; }
    public void setStopNumber(Integer stopNumber) { this.stopNumber = stopNumber; }
}
