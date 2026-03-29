package com.trainapp.dto;

import java.time.LocalDateTime;
import java.util.List;

public class BookingResponse {
    private Long id;
    private String pnr;
    private String trainNumber;
    private String trainName;
    private String boardingStation;
    private String destinationStation;
    private LocalDateTime bookingTime;
    private String journeyDate;
    private String status;
    private Double totalFare;
    private Double refundAmount;
    private List<PassengerResponse> passengers;

    public BookingResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPnr() { return pnr; }
    public void setPnr(String pnr) { this.pnr = pnr; }
    public String getTrainNumber() { return trainNumber; }
    public void setTrainNumber(String trainNumber) { this.trainNumber = trainNumber; }
    public String getTrainName() { return trainName; }
    public void setTrainName(String trainName) { this.trainName = trainName; }
    public String getBoardingStation() { return boardingStation; }
    public void setBoardingStation(String boardingStation) { this.boardingStation = boardingStation; }
    public String getDestinationStation() { return destinationStation; }
    public void setDestinationStation(String destinationStation) { this.destinationStation = destinationStation; }
    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }
    public String getJourneyDate() { return journeyDate; }
    public void setJourneyDate(String journeyDate) { this.journeyDate = journeyDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getTotalFare() { return totalFare; }
    public void setTotalFare(Double totalFare) { this.totalFare = totalFare; }
    public Double getRefundAmount() { return refundAmount; }
    public void setRefundAmount(Double refundAmount) { this.refundAmount = refundAmount; }
    public List<PassengerResponse> getPassengers() { return passengers; }
    public void setPassengers(List<PassengerResponse> passengers) { this.passengers = passengers; }
}
