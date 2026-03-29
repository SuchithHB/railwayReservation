package com.trainapp.repository;

import com.trainapp.entity.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TrainRepository extends JpaRepository<Train, Long> {

    Optional<Train> findByTrainNumber(String trainNumber);

    boolean existsByTrainNumber(String trainNumber);

    @Query("SELECT DISTINCT t FROM Train t JOIN t.stations s1 JOIN t.stations s2 " +
           "WHERE LOWER(s1.stationName) = LOWER(:source) " +
           "AND LOWER(s2.stationName) = LOWER(:destination) " +
           "AND s1.stopNumber < s2.stopNumber " +
           "AND t.date = :date")
    List<Train> searchTrains(@Param("source") String source,
                             @Param("destination") String destination,
                             @Param("date") LocalDate date);

    @Query("SELECT DISTINCT t FROM Train t JOIN t.stations s1 JOIN t.stations s2 " +
           "WHERE LOWER(s1.stationName) = LOWER(:source) " +
           "AND LOWER(s2.stationName) = LOWER(:destination) " +
           "AND s1.stopNumber < s2.stopNumber")
    List<Train> searchTrainsWithoutDate(@Param("source") String source,
                                        @Param("destination") String destination);
}
