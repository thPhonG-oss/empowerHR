package com.hr_management.hr_management.entity;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Entity
@Table(name = "WorkLocation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WorkLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "work_location_id")
    Integer work_location_id;

    String name;
    String address;

    @Column(columnDefinition = "JSON", name = "allowed_ip_ranges")
    String allowedIpRanges;

    public List<String> getIpRanges() {
        try {
            return new ObjectMapper().readValue(allowedIpRanges, new TypeReference<List<String>>() {});
        }
        catch (Exception e) {
            return List.of();
        }
    }
}
