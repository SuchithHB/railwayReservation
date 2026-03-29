package com.trainapp.controller;

import com.trainapp.dto.*;
import com.trainapp.service.BookingService;
import com.trainapp.service.TrainService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final TrainService trainService;
    private final BookingService bookingService;

    public AdminController(TrainService trainService, BookingService bookingService) {
        this.trainService = trainService;
        this.bookingService = bookingService;
    }

    @PostMapping("/trains")
    public ResponseEntity<ApiResponse<TrainDTO>> createTrain(@Valid @RequestBody TrainRequest request) {
        TrainDTO train = trainService.createTrain(request);
        return ResponseEntity.ok(ApiResponse.success("Train created successfully", train));
    }

    @PutMapping("/trains/{id}")
    public ResponseEntity<ApiResponse<TrainDTO>> updateTrain(
            @PathVariable Long id,
            @Valid @RequestBody TrainRequest request) {
        TrainDTO train = trainService.updateTrain(id, request);
        return ResponseEntity.ok(ApiResponse.success("Train updated successfully", train));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        List<BookingResponse> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success("All bookings fetched", bookings));
    }

    @GetMapping("/trains")
    public ResponseEntity<ApiResponse<List<TrainDTO>>> getAllTrains() {
        List<TrainDTO> trains = trainService.getAllTrains();
        return ResponseEntity.ok(ApiResponse.success("All trains", trains));
    }
}
