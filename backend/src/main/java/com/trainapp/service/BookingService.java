package com.trainapp.service;

import com.trainapp.dto.*;
import com.trainapp.entity.*;
import com.trainapp.repository.BookingRepository;
import com.trainapp.repository.TrainRepository;
import com.trainapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TrainRepository trainRepository;
    private final UserRepository userRepository;
    private final Random random = new Random();

    public BookingService(BookingRepository bookingRepository, TrainRepository trainRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.trainRepository = trainRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Train train = trainRepository.findById(request.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        int passengerCount = request.getPassengers().size();
        boolean isWaitlisted = train.getAvailableSeats() < passengerCount;
        BookingStatus status = isWaitlisted ? BookingStatus.WAITLISTED : BookingStatus.CONFIRMED;

        String pnr = generatePNR();
        double totalFare = train.getBaseFare() * passengerCount;

        Booking booking = new Booking();
        booking.setPnr(pnr);
        booking.setUser(user);
        booking.setTrain(train);
        booking.setBoardingStation(request.getBoardingStation());
        booking.setDestinationStation(request.getDestinationStation());
        booking.setBookingTime(LocalDateTime.now());
        booking.setJourneyDate(train.getDate());
        booking.setStatus(status);
        booking.setTotalFare(totalFare);

        int currentSeatNumber = train.getTotalSeats() - train.getAvailableSeats() + 1;
        for (PassengerRequest pr : request.getPassengers()) {
            String seatNum = isWaitlisted ? "WL" : "S" + currentSeatNumber++;
            Passenger passenger = new Passenger();
            passenger.setName(pr.getName());
            passenger.setAge(pr.getAge());
            passenger.setGender(pr.getGender());
            passenger.setSeatNumber(seatNum);
            booking.addPassenger(passenger);
        }

        if (!isWaitlisted) {
            train.setAvailableSeats(train.getAvailableSeats() - passengerCount);
            trainRepository.save(train);
        }

        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    @Transactional
    public BookingResponse cancelBooking(String pnr) {
        Booking booking = bookingRepository.findByPnr(pnr)
                .orElseThrow(() -> new RuntimeException("Booking not found with PNR: " + pnr));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        boolean wasConfirmed = booking.getStatus() == BookingStatus.CONFIRMED;

        double refundAmount = calculateRefund(booking);
        booking.setRefundAmount(refundAmount);
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        if (wasConfirmed) {
            Train train = booking.getTrain();
            int passengerCount = booking.getPassengers().size();
            train.setAvailableSeats(train.getAvailableSeats() + passengerCount);
            trainRepository.save(train);
            autoConfirmWaitlisted(train);
        }

        return toResponse(booking);
    }

    private void autoConfirmWaitlisted(Train train) {
        List<Booking> waitlisted = bookingRepository.findByTrainAndStatusOrderByBookingTimeAsc(
                train, BookingStatus.WAITLISTED);

        for (Booking wlBooking : waitlisted) {
            int passengerCount = wlBooking.getPassengers().size();
            if (train.getAvailableSeats() >= passengerCount) {
                wlBooking.setStatus(BookingStatus.CONFIRMED);
                int seatStart = train.getTotalSeats() - train.getAvailableSeats() + 1;
                for (Passenger p : wlBooking.getPassengers()) {
                    p.setSeatNumber("S" + seatStart++);
                }
                train.setAvailableSeats(train.getAvailableSeats() - passengerCount);
                bookingRepository.save(wlBooking);
                trainRepository.save(train);
            } else {
                break;
            }
        }
    }

    private double calculateRefund(Booking booking) {
        if (booking.getStatus() == BookingStatus.WAITLISTED) {
            return booking.getTotalFare();
        }
        long hoursUntilJourney = ChronoUnit.HOURS.between(
                LocalDateTime.now(), booking.getJourneyDate().atStartOfDay());
        if (hoursUntilJourney > 48) {
            return booking.getTotalFare() * 0.90;
        } else if (hoursUntilJourney > 24) {
            return booking.getTotalFare() * 0.70;
        } else {
            return booking.getTotalFare() * 0.50;
        }
    }

    public BookingResponse getBookingByPnr(String pnr) {
        Booking booking = bookingRepository.findByPnr(pnr)
                .orElseThrow(() -> new RuntimeException("Booking not found with PNR: " + pnr));
        return toResponse(booking);
    }

    public List<BookingResponse> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserOrderByBookingTimeDesc(user)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByBookingTimeDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private String generatePNR() {
        String pnr;
        do {
            pnr = "PNR" + String.format("%06d", random.nextInt(1000000));
        } while (bookingRepository.findByPnr(pnr).isPresent());
        return pnr;
    }

    private BookingResponse toResponse(Booking booking) {
        List<PassengerResponse> passengers = booking.getPassengers().stream()
                .map(p -> new PassengerResponse(p.getId(), p.getName(), p.getAge(),
                        p.getGender(), p.getSeatNumber()))
                .collect(Collectors.toList());

        BookingResponse resp = new BookingResponse();
        resp.setId(booking.getId());
        resp.setPnr(booking.getPnr());
        resp.setTrainNumber(booking.getTrain().getTrainNumber());
        resp.setTrainName(booking.getTrain().getTrainName());
        resp.setBoardingStation(booking.getBoardingStation());
        resp.setDestinationStation(booking.getDestinationStation());
        resp.setBookingTime(booking.getBookingTime());
        resp.setJourneyDate(booking.getJourneyDate().toString());
        resp.setStatus(booking.getStatus().name());
        resp.setTotalFare(booking.getTotalFare());
        resp.setRefundAmount(booking.getRefundAmount());
        resp.setPassengers(passengers);
        return resp;
    }
}
