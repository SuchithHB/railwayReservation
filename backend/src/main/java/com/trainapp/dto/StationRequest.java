package com.trainapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class StationRequest {
    @NotBlank(message = "Station name is required")
    private String stationName;

    @NotBlank(message = "Arrival time is required")
    private String arrivalTime;

    @NotBlank(message = "Departure time is required")
    private String departureTime;

    @NotNull(message = "Stop number is required")
    private Integer stopNumber;

    public StationRequest() {}

    public String getStationName() { return stationName; }
    public void setStationName(String stationName) { this.stationName = stationName; }
    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }
    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
    public Integer getStopNumber() { return stopNumber; }
    public void setStopNumber(Integer stopNumber) { this.stopNumber = stopNumber; }
}
