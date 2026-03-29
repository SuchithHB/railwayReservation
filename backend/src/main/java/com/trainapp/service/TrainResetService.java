package com.trainapp.service;

import com.trainapp.entity.Booking;
import com.trainapp.entity.BookingStatus;
import com.trainapp.entity.Train;
import com.trainapp.repository.BookingRepository;
import com.trainapp.repository.TrainRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TrainResetService {

    private final TrainRepository trainRepository;
    private final BookingRepository bookingRepository;

    public TrainResetService(TrainRepository trainRepository, BookingRepository bookingRepository) {
        this.trainRepository = trainRepository;
        this.bookingRepository = bookingRepository;
    }

    /**
     * Every 2 hours, reset all trains whose journey date has passed.
     * Moves their date to tomorrow, restores all seats, and clears old bookings.
     * This ensures the system always has trains available for demo purposes.
     */
    @Scheduled(fixedRate = 60000) // 1 minute in ms
    @Transactional
    public void resetExpiredTrains() {
        LocalDate today = LocalDate.now();
        List<Train> expiredTrains = trainRepository.findAll().stream()
                .filter(t -> t.getDate().isBefore(today))
                .toList();

        if (expiredTrains.isEmpty()) return;

        for (Train train : expiredTrains) {
            // Cancel all active bookings for this train
            List<Booking> activeBookings = bookingRepository.findByTrainAndStatusOrderByBookingTimeAsc(
                    train, BookingStatus.CONFIRMED);
            List<Booking> waitlisted = bookingRepository.findByTrainAndStatusOrderByBookingTimeAsc(
                    train, BookingStatus.WAITLISTED);

            for (Booking b : activeBookings) {
                b.setStatus(BookingStatus.CANCELLED);
                b.setRefundAmount(b.getTotalFare());
                bookingRepository.save(b);
            }
            for (Booking b : waitlisted) {
                b.setStatus(BookingStatus.CANCELLED);
                b.setRefundAmount(b.getTotalFare());
                bookingRepository.save(b);
            }

            // Reset train: move date to tomorrow, restore all seats
            train.setDate(today.plusDays(1));
            train.setAvailableSeats(train.getTotalSeats());
            trainRepository.save(train);
        }

        System.out.println("=== Auto-reset: " + expiredTrains.size() + " trains reset to tomorrow ===");
    }
}
