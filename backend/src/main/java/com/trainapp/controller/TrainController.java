package com.trainapp.controller;

import com.trainapp.dto.*;
import com.trainapp.service.TrainService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trains")
public class TrainController {

    private final TrainService trainService;

    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<TrainDTO>>> searchTrains(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam(required = false) String date) {
        List<TrainDTO> trains = trainService.searchTrains(source, destination, date);
        return ResponseEntity.ok(ApiResponse.success("Trains found: " + trains.size(), trains));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TrainDTO>> getTrainById(@PathVariable Long id) {
        TrainDTO train = trainService.getTrainById(id);
        return ResponseEntity.ok(ApiResponse.success("Train details fetched", train));
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TrainStatusDTO>> getTrainStatus(@PathVariable Long id) {
        TrainStatusDTO status = trainService.getTrainStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Train status fetched", status));
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<ApiResponse<SeatAvailabilityDTO>> getSeatAvailability(@PathVariable Long id) {
        SeatAvailabilityDTO seats = trainService.getSeatAvailability(id);
        return ResponseEntity.ok(ApiResponse.success("Seat availability fetched", seats));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TrainDTO>>> getAllTrains() {
        List<TrainDTO> trains = trainService.getAllTrains();
        return ResponseEntity.ok(ApiResponse.success("All trains", trains));
    }
}
