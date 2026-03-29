package com.trainapp.repository;

import com.trainapp.entity.Booking;
import com.trainapp.entity.BookingStatus;
import com.trainapp.entity.Train;
import com.trainapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByPnr(String pnr);
    List<Booking> findByUserOrderByBookingTimeDesc(User user);
    List<Booking> findByTrainAndStatusOrderByBookingTimeAsc(Train train, BookingStatus status);
    List<Booking> findAllByOrderByBookingTimeDesc();
}
