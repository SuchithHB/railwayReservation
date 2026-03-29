package com.trainapp.service;

import com.trainapp.dto.*;
import com.trainapp.entity.Booking;
import com.trainapp.entity.BookingStatus;
import com.trainapp.entity.Station;
import com.trainapp.entity.Train;
import com.trainapp.repository.BookingRepository;
import com.trainapp.repository.TrainRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TrainService {

    private final TrainRepository trainRepository;
    private final BookingRepository bookingRepository;

    public TrainService(TrainRepository trainRepository, BookingRepository bookingRepository) {
        this.trainRepository = trainRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public List<TrainDTO> searchTrains(String source, String destination, String date) {
        List<Train> trains;
        if (date != null && !date.isEmpty()) {
            trains = trainRepository.searchTrains(source, destination, LocalDate.parse(date));
        } else {
            trains = trainRepository.searchTrainsWithoutDate(source, destination);
        }
        return trains.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public TrainDTO getTrainById(Long id) {
        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Train not found with id: " + id));
        return toDTO(train);
    }

    @Transactional
    public TrainDTO createTrain(TrainRequest request) {
        if (trainRepository.existsByTrainNumber(request.getTrainNumber())) {
            throw new RuntimeException("Train with number " + request.getTrainNumber() + " already exists");
        }

        Train train = new Train();
        train.setTrainNumber(request.getTrainNumber());
        train.setTrainName(request.getTrainName());
        train.setSource(request.getSource());
        train.setDestination(request.getDestination());
        train.setTotalSeats(request.getTotalSeats());
        train.setAvailableSeats(request.getTotalSeats());
        train.setBaseFare(request.getBaseFare());
        train.setDepartureTime(LocalTime.parse(request.getDepartureTime()));
        train.setArrivalTime(LocalTime.parse(request.getArrivalTime()));
        train.setDate(LocalDate.parse(request.getDate()));

        if (request.getStations() != null) {
            for (StationRequest sr : request.getStations()) {
                Station station = new Station();
                station.setStationName(sr.getStationName());
                station.setArrivalTime(LocalTime.parse(sr.getArrivalTime()));
                station.setDepartureTime(LocalTime.parse(sr.getDepartureTime()));
                station.setStopNumber(sr.getStopNumber());
                train.addStation(station);
            }
        }

        Train saved = trainRepository.save(train);
        return toDTO(saved);
    }

    @Transactional
    public TrainDTO updateTrain(Long id, TrainRequest request) {
        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Train not found with id: " + id));

        train.setTrainName(request.getTrainName());
        train.setSource(request.getSource());
        train.setDestination(request.getDestination());
        train.setTotalSeats(request.getTotalSeats());
        train.setBaseFare(request.getBaseFare());
        train.setDepartureTime(LocalTime.parse(request.getDepartureTime()));
        train.setArrivalTime(LocalTime.parse(request.getArrivalTime()));
        train.setDate(LocalDate.parse(request.getDate()));

        train.getStations().clear();
        if (request.getStations() != null) {
            for (StationRequest sr : request.getStations()) {
                Station station = new Station();
                station.setStationName(sr.getStationName());
                station.setArrivalTime(LocalTime.parse(sr.getArrivalTime()));
                station.setDepartureTime(LocalTime.parse(sr.getDepartureTime()));
                station.setStopNumber(sr.getStopNumber());
                train.addStation(station);
            }
        }

        Train saved = trainRepository.save(train);
        return toDTO(saved);
    }

    @Transactional
    public TrainStatusDTO getTrainStatus(Long id) {
        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Train not found with id: " + id));

        List<Station> stations = train.getStations();
        if (stations.isEmpty()) {
            return new TrainStatusDTO(train.getTrainName(), train.getTrainNumber(),
                    null, null, 0.0, "NO_ROUTE_DATA", null);
        }

        LocalTime now = LocalTime.now();
        Station firstStation = stations.get(0);
        Station lastStation = stations.get(stations.size() - 1);

        // Before departure
        if (now.isBefore(firstStation.getDepartureTime())) {
            return new TrainStatusDTO(train.getTrainName(), train.getTrainNumber(),
                    firstStation.getStationName(),
                    stations.size() > 1 ? stations.get(1).getStationName() : null,
                    0.0, "NOT_STARTED", firstStation.getDepartureTime().toString());
        }

        // After arrival at final station
        if (now.isAfter(lastStation.getArrivalTime())) {
            return new TrainStatusDTO(train.getTrainName(), train.getTrainNumber(),
                    lastStation.getStationName(), null,
                    100.0, "COMPLETED", "Arrived");
        }

        // En route — find current position
        for (int i = 0; i < stations.size() - 1; i++) {
            Station current = stations.get(i);
            Station next = stations.get(i + 1);

            if ((now.isAfter(current.getDepartureTime()) || now.equals(current.getDepartureTime()))
                    && now.isBefore(next.getArrivalTime())) {

                double progress = calculateProgress(firstStation, lastStation, now);
                return new TrainStatusDTO(train.getTrainName(), train.getTrainNumber(),
                        current.getStationName(), next.getStationName(),
                        Math.round(progress * 10.0) / 10.0, "EN_ROUTE", next.getArrivalTime().toString());
            }

            // At a station
            if ((now.isAfter(current.getArrivalTime()) || now.equals(current.getArrivalTime()))
                    && (now.isBefore(current.getDepartureTime()) || now.equals(current.getDepartureTime()))) {

                double progress = calculateProgress(firstStation, lastStation, now);
                return new TrainStatusDTO(train.getTrainName(), train.getTrainNumber(),
                        current.getStationName(), next.getStationName(),
                        Math.round(progress * 10.0) / 10.0, "ARRIVED", current.getDepartureTime().toString());
            }
        }

        // Fallback
        double progress = calculateProgress(firstStation, lastStation, now);
        return new TrainStatusDTO(train.getTrainName(), train.getTrainNumber(),
                stations.get(0).getStationName(), stations.get(stations.size() - 1).getStationName(),
                Math.round(progress * 10.0) / 10.0, "EN_ROUTE", null);
    }

    private double calculateProgress(Station first, Station last, LocalTime now) {
        long totalMinutes = ChronoUnit.MINUTES.between(first.getDepartureTime(), last.getArrivalTime());
        long elapsedMinutes = ChronoUnit.MINUTES.between(first.getDepartureTime(), now);
        return totalMinutes > 0 ? Math.min(100.0, (elapsedMinutes * 100.0) / totalMinutes) : 0.0;
    }

    @Transactional
    public List<TrainDTO> getAllTrains() {
        return trainRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private TrainDTO toDTO(Train train) {
        List<StationDTO> stationDTOs = train.getStations().stream()
                .map(s -> new StationDTO(s.getId(), s.getStationName(), s.getArrivalTime(),
                        s.getDepartureTime(), s.getStopNumber()))
                .collect(Collectors.toList());

        TrainDTO dto = new TrainDTO();
        dto.setId(train.getId());
        dto.setTrainNumber(train.getTrainNumber());
        dto.setTrainName(train.getTrainName());
        dto.setSource(train.getSource());
        dto.setDestination(train.getDestination());
        dto.setTotalSeats(train.getTotalSeats());
        dto.setAvailableSeats(train.getAvailableSeats());
        dto.setBaseFare(train.getBaseFare());
        dto.setDepartureTime(train.getDepartureTime());
        dto.setArrivalTime(train.getArrivalTime());
        dto.setDate(train.getDate().toString());
        dto.setStations(stationDTOs);
        return dto;
    }

    @Transactional
    public SeatAvailabilityDTO getSeatAvailability(Long id) {
        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Train not found with id: " + id));

        // Get all booked seat numbers from confirmed bookings
        List<Booking> confirmedBookings = bookingRepository.findByTrainAndStatusOrderByBookingTimeAsc(
                train, BookingStatus.CONFIRMED);
        Set<String> bookedSeats = new HashSet<>();
        for (Booking b : confirmedBookings) {
            b.getPassengers().forEach(p -> {
                if (p.getSeatNumber() != null && !p.getSeatNumber().startsWith("WL")) {
                    bookedSeats.add(p.getSeatNumber());
                }
            });
        }

        // Generate all seat numbers
        List<String> allSeats = new ArrayList<>();
        for (int i = 1; i <= train.getTotalSeats(); i++) {
            allSeats.add("S" + i);
        }

        List<String> availableSeats = allSeats.stream()
                .filter(s -> !bookedSeats.contains(s))
                .collect(Collectors.toList());

        SeatAvailabilityDTO dto = new SeatAvailabilityDTO();
        dto.setTrainId(train.getId());
        dto.setTrainName(train.getTrainName());
        dto.setTotalSeats(train.getTotalSeats());
        dto.setAvailableSeats(train.getAvailableSeats());
        dto.setBookedSeats(bookedSeats.size());
        dto.setBookedSeatNumbers(new ArrayList<>(bookedSeats));
        dto.setAvailableSeatNumbers(availableSeats);
        return dto;
    }
}
