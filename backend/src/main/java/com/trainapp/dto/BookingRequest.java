package com.trainapp.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class BookingRequest {
    @NotNull(message = "Train ID is required")
    private Long trainId;

    @NotBlank(message = "Boarding station is required")
    private String boardingStation;

    @NotBlank(message = "Destination station is required")
    private String destinationStation;

    @Valid
    private List<PassengerRequest> passengers;

    public BookingRequest() {}

    public Long getTrainId() { return trainId; }
    public void setTrainId(Long trainId) { this.trainId = trainId; }
    public String getBoardingStation() { return boardingStation; }
    public void setBoardingStation(String boardingStation) { this.boardingStation = boardingStation; }
    public String getDestinationStation() { return destinationStation; }
    public void setDestinationStation(String destinationStation) { this.destinationStation = destinationStation; }
    public List<PassengerRequest> getPassengers() { return passengers; }
    public void setPassengers(List<PassengerRequest> passengers) { this.passengers = passengers; }
}
