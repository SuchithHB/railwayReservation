package com.trainapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "stations")
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String stationName;

    @Column(nullable = false)
    private LocalTime arrivalTime;

    @Column(nullable = false)
    private LocalTime departureTime;

    @Column(nullable = false)
    private Integer stopNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "train_id", nullable = false)
    @JsonIgnore
    private Train train;

    public Station() {}

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
    public Train getTrain() { return train; }
    public void setTrain(Train train) { this.train = train; }
}
