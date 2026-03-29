package com.trainapp.dto;

public class TrainStatusDTO {
    private String trainName;
    private String trainNumber;
    private String currentStation;
    private String nextStation;
    private Double progressPercent;
    private String status;
    private String estimatedArrival;

    public TrainStatusDTO() {}

    public TrainStatusDTO(String trainName, String trainNumber, String currentStation,
                          String nextStation, Double progressPercent, String status, String estimatedArrival) {
        this.trainName = trainName;
        this.trainNumber = trainNumber;
        this.currentStation = currentStation;
        this.nextStation = nextStation;
        this.progressPercent = progressPercent;
        this.status = status;
        this.estimatedArrival = estimatedArrival;
    }

    public String getTrainName() { return trainName; }
    public void setTrainName(String trainName) { this.trainName = trainName; }
    public String getTrainNumber() { return trainNumber; }
    public void setTrainNumber(String trainNumber) { this.trainNumber = trainNumber; }
    public String getCurrentStation() { return currentStation; }
    public void setCurrentStation(String currentStation) { this.currentStation = currentStation; }
    public String getNextStation() { return nextStation; }
    public void setNextStation(String nextStation) { this.nextStation = nextStation; }
    public Double getProgressPercent() { return progressPercent; }
    public void setProgressPercent(Double progressPercent) { this.progressPercent = progressPercent; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getEstimatedArrival() { return estimatedArrival; }
    public void setEstimatedArrival(String estimatedArrival) { this.estimatedArrival = estimatedArrival; }
}
