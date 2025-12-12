package com.hr_management.hr_management.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RunningActivityUpdateRequestDTO {
    @NotBlank(message = "Title is required")
    @Schema(example = "Marathon 2024")
    String title;

    @NotBlank(message = "Image url is required")
    @Schema(example = "https://example.com/image.jpg")
    String image;

    @Schema(example = "Join us for an exciting marathon event!")
    String description;

    @Schema(example = "2024-01-01")
    @NotNull(message = "registration start date must be provided")
    LocalDate registrationStartDate;

    @Schema(example = "2024-01-31")
    @NotNull(message = "registration end date must be provided")
    LocalDate registrationEndDate;

    @Schema(example = "2024-03-01")
    @NotNull(message = "start date must be provided")
    LocalDate startDate;

    @Schema(example = "2024-03-31")
    @NotNull(message = "end date must be provided")
    LocalDate endDate;

    @Schema(example = "10")
    @NotNull(message = "Minimum participant is required")
    Integer minParticipant;

    @Schema(example = "100")
    @NotNull(message = "Maximum participant is required")
    Integer maxParticipant;

    @NotNull(message = "Target distance is required")
    @Schema(example = "42")
    Integer targetDistance;
    String rules;

    Integer completionBonus;
    Integer top1Bonus;
    Integer top2Bonus;
    Integer top3Bonus;
}
