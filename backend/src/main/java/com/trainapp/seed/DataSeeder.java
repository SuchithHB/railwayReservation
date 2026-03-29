package com.trainapp.seed;

import com.trainapp.entity.*;
import com.trainapp.repository.TrainRepository;
import com.trainapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final TrainRepository trainRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(TrainRepository trainRepository, UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.trainRepository = trainRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Create admin user if not exists
        if (!userRepository.existsByEmail("admin@train.com")) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@train.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setPhone("9999999999");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }

        // Only seed if no trains exist
        if (trainRepository.count() > 0) return;

        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalDate dayAfter = LocalDate.now().plusDays(2);

        // 1. Rajdhani Express
        createTrain("12951", "Mumbai Rajdhani Express", "New Delhi", "Mumbai Central",
                500, 1450.0, "16:00", "08:35", tomorrow,
                new String[][]{
                        {"New Delhi", "16:00", "16:00", "1"},
                        {"Mathura Junction", "17:45", "17:47", "2"},
                        {"Kota Junction", "20:30", "20:35", "3"},
                        {"Vadodara Junction", "01:30", "01:35", "4"},
                        {"Surat", "03:15", "03:18", "5"},
                        {"Mumbai Central", "08:35", "08:35", "6"}
                });

        // 2. Shatabdi Express
        createTrain("12001", "Bhopal Shatabdi Express", "New Delhi", "Bhopal",
                400, 950.0, "06:15", "14:30", tomorrow,
                new String[][]{
                        {"New Delhi", "06:15", "06:15", "1"},
                        {"Agra Cantt", "08:10", "08:12", "2"},
                        {"Gwalior", "09:35", "09:37", "3"},
                        {"Jhansi Junction", "11:00", "11:05", "4"},
                        {"Bhopal", "14:30", "14:30", "5"}
                });

        // 3. Duronto Express
        createTrain("12261", "Howrah Duronto Express", "Howrah", "Mumbai CST",
                450, 1650.0, "20:10", "19:45", tomorrow,
                new String[][]{
                        {"Howrah", "20:10", "20:10", "1"},
                        {"Nagpur", "06:30", "06:40", "2"},
                        {"Bhusaval Junction", "11:15", "11:20", "3"},
                        {"Mumbai CST", "19:45", "19:45", "4"}
                });

        // 4. Tamil Nadu Express
        createTrain("12621", "Tamil Nadu Express", "Chennai Central", "New Delhi",
                550, 1250.0, "22:00", "06:30", tomorrow,
                new String[][]{
                        {"Chennai Central", "22:00", "22:00", "1"},
                        {"Vijayawada", "04:10", "04:15", "2"},
                        {"Nagpur", "14:30", "14:40", "3"},
                        {"Bhopal", "21:00", "21:10", "4"},
                        {"Agra Cantt", "02:30", "02:35", "5"},
                        {"New Delhi", "06:30", "06:30", "6"}
                });

        // 5. Garib Rath Express
        createTrain("12203", "Garib Rath Express", "New Delhi", "Lucknow",
                600, 550.0, "22:45", "05:30", tomorrow,
                new String[][]{
                        {"New Delhi", "22:45", "22:45", "1"},
                        {"Ghaziabad", "23:15", "23:17", "2"},
                        {"Aligarh Junction", "01:00", "01:02", "3"},
                        {"Kanpur Central", "03:50", "03:55", "4"},
                        {"Lucknow", "05:30", "05:30", "5"}
                });

        // 6. Deccan Queen
        createTrain("12123", "Deccan Queen", "Mumbai CST", "Pune Junction",
                300, 350.0, "17:10", "20:25", tomorrow,
                new String[][]{
                        {"Mumbai CST", "17:10", "17:10", "1"},
                        {"Dadar", "17:25", "17:27", "2"},
                        {"Kalyan Junction", "18:05", "18:07", "3"},
                        {"Lonavala", "19:15", "19:17", "4"},
                        {"Pune Junction", "20:25", "20:25", "5"}
                });

        // 7. Vande Bharat Express
        createTrain("22435", "Vande Bharat Express", "New Delhi", "Varanasi",
                400, 1800.0, "06:00", "14:00", tomorrow,
                new String[][]{
                        {"New Delhi", "06:00", "06:00", "1"},
                        {"Kanpur Central", "10:00", "10:02", "2"},
                        {"Prayagraj Junction", "11:50", "11:52", "3"},
                        {"Varanasi", "14:00", "14:00", "4"}
                });

        // 8. Karnataka Express
        createTrain("12627", "Karnataka Express", "New Delhi", "Bangalore",
                500, 1350.0, "21:10", "06:40", tomorrow,
                new String[][]{
                        {"New Delhi", "21:10", "21:10", "1"},
                        {"Agra Cantt", "00:05", "00:10", "2"},
                        {"Jhansi Junction", "03:00", "03:10", "3"},
                        {"Raichur", "20:30", "20:35", "4"},
                        {"Guntakal Junction", "22:00", "22:10", "5"},
                        {"Bangalore", "06:40", "06:40", "6"}
                });

        // 9. Howrah Mail
        createTrain("12839", "Howrah Mail", "Chennai Central", "Howrah",
                480, 850.0, "23:50", "03:10", tomorrow,
                new String[][]{
                        {"Chennai Central", "23:50", "23:50", "1"},
                        {"Vijayawada", "06:15", "06:25", "2"},
                        {"Visakhapatnam", "11:40", "11:50", "3"},
                        {"Bhubaneswar", "19:15", "19:25", "4"},
                        {"Kharagpur", "23:30", "23:35", "5"},
                        {"Howrah", "03:10", "03:10", "6"}
                });

        // 10. August Kranti Rajdhani
        createTrain("12953", "August Kranti Rajdhani", "Mumbai Central", "New Delhi",
                500, 1500.0, "17:40", "10:55", tomorrow,
                new String[][]{
                        {"Mumbai Central", "17:40", "17:40", "1"},
                        {"Surat", "20:48", "20:50", "2"},
                        {"Vadodara Junction", "22:15", "22:20", "3"},
                        {"Ratlam Junction", "02:15", "02:20", "4"},
                        {"Kota Junction", "05:20", "05:25", "5"},
                        {"New Delhi", "10:55", "10:55", "6"}
                });

        // 11. Coromandel Express
        createTrain("12841", "Coromandel Express", "Howrah", "Chennai Central",
                450, 900.0, "14:50", "17:15", tomorrow,
                new String[][]{
                        {"Howrah", "14:50", "14:50", "1"},
                        {"Kharagpur", "16:40", "16:45", "2"},
                        {"Bhubaneswar", "21:20", "21:30", "3"},
                        {"Visakhapatnam", "03:45", "03:55", "4"},
                        {"Vijayawada", "09:05", "09:15", "5"},
                        {"Chennai Central", "17:15", "17:15", "6"}
                });

        // 12. Tejas Express
        createTrain("22119", "Tejas Express", "Mumbai CST", "Madgaon",
                350, 1100.0, "05:50", "14:00", tomorrow,
                new String[][]{
                        {"Mumbai CST", "05:50", "05:50", "1"},
                        {"Panvel", "06:40", "06:42", "2"},
                        {"Ratnagiri", "10:30", "10:35", "3"},
                        {"Kudal", "12:15", "12:18", "4"},
                        {"Madgaon", "14:00", "14:00", "5"}
                });

        // 13. Humsafar Express
        createTrain("22501", "Humsafar Express", "Gorakhpur", "Mumbai LTT",
                480, 1200.0, "11:15", "18:30", tomorrow,
                new String[][]{
                        {"Gorakhpur", "11:15", "11:15", "1"},
                        {"Lucknow", "16:30", "16:40", "2"},
                        {"Jhansi Junction", "22:30", "22:40", "3"},
                        {"Bhopal", "03:00", "03:10", "4"},
                        {"Bhusaval Junction", "10:00", "10:10", "5"},
                        {"Mumbai LTT", "18:30", "18:30", "6"}
                });

        // 14. Sampark Kranti Express
        createTrain("12393", "Sampark Kranti Express", "New Delhi", "Patna Junction",
                520, 750.0, "20:15", "10:10", tomorrow,
                new String[][]{
                        {"New Delhi", "20:15", "20:15", "1"},
                        {"Kanpur Central", "01:40", "01:50", "2"},
                        {"Prayagraj Junction", "04:35", "04:45", "3"},
                        {"Varanasi", "07:10", "07:15", "4"},
                        {"Patna Junction", "10:10", "10:10", "5"}
                });

        // 15. Gatimaan Express
        createTrain("12049", "Gatimaan Express", "Delhi Hazrat Nizamuddin", "Agra Cantt",
                350, 750.0, "08:10", "09:50", tomorrow,
                new String[][]{
                        {"Delhi Hazrat Nizamuddin", "08:10", "08:10", "1"},
                        {"Mathura Junction", "09:15", "09:17", "2"},
                        {"Agra Cantt", "09:50", "09:50", "3"}
                });

        // 16. Jan Shatabdi Express
        createTrain("12031", "Jan Shatabdi Express", "Lucknow", "New Delhi",
                450, 450.0, "06:30", "12:45", dayAfter,
                new String[][]{
                        {"Lucknow", "06:30", "06:30", "1"},
                        {"Kanpur Central", "07:40", "07:45", "2"},
                        {"Etawah", "09:00", "09:02", "3"},
                        {"Agra Cantt", "10:30", "10:35", "4"},
                        {"New Delhi", "12:45", "12:45", "5"}
                });

        // 17. Grand Trunk Express
        createTrain("12615", "Grand Trunk Express", "New Delhi", "Chennai Central",
                500, 1100.0, "18:55", "07:10", dayAfter,
                new String[][]{
                        {"New Delhi", "18:55", "18:55", "1"},
                        {"Agra Cantt", "22:20", "22:25", "2"},
                        {"Jhansi Junction", "01:00", "01:10", "3"},
                        {"Nagpur", "10:30", "10:45", "4"},
                        {"Vijayawada", "22:45", "22:55", "5"},
                        {"Chennai Central", "07:10", "07:10", "6"}
                });

        // 18. Shatabdi Express (Bangalore-Mysore)
        createTrain("12007", "Shatabdi Express", "Bangalore", "Mysore",
                300, 350.0, "11:00", "13:05", tomorrow,
                new String[][]{
                        {"Bangalore", "11:00", "11:00", "1"},
                        {"Mandya", "12:15", "12:17", "2"},
                        {"Mysore", "13:05", "13:05", "3"}
                });

        System.out.println("=== Data seeding complete! 18 trains loaded. ===");
    }

    private void createTrain(String number, String name, String source, String destination,
                             int seats, double fare, String depTime, String arrTime,
                             LocalDate date, String[][] stationData) {
        Train train = new Train();
        train.setTrainNumber(number);
        train.setTrainName(name);
        train.setSource(source);
        train.setDestination(destination);
        train.setTotalSeats(seats);
        train.setAvailableSeats(seats);
        train.setBaseFare(fare);
        train.setDepartureTime(LocalTime.parse(depTime));
        train.setArrivalTime(LocalTime.parse(arrTime));
        train.setDate(date);

        for (String[] s : stationData) {
            Station station = new Station();
            station.setStationName(s[0]);
            station.setArrivalTime(LocalTime.parse(s[1]));
            station.setDepartureTime(LocalTime.parse(s[2]));
            station.setStopNumber(Integer.parseInt(s[3]));
            train.addStation(station);
        }

        trainRepository.save(train);
    }
}
