package com.trainapp.controller;

import com.trainapp.dto.*;
import com.trainapp.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {
        BookingResponse response = bookingService.createBooking(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Booking created successfully", response));
    }

    @PutMapping("/{pnr}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(@PathVariable String pnr) {
        BookingResponse response = bookingService.cancelBooking(pnr);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", response));
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getUserBookings(Authentication authentication) {
        List<BookingResponse> bookings = bookingService.getUserBookings(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("User bookings fetched", bookings));
    }

    @GetMapping("/{pnr}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingByPnr(@PathVariable String pnr) {
        BookingResponse response = bookingService.getBookingByPnr(pnr);
        return ResponseEntity.ok(ApiResponse.success("Booking details fetched", response));
    }
}
