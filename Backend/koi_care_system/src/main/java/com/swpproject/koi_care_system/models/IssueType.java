package com.swpproject.koi_care_system.models;

import com.swpproject.koi_care_system.enums.RangeParameter;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class IssueType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;
    @Enumerated(EnumType.STRING)
    RangeParameter parameterType;
    String conditionType;
    @OneToMany(mappedBy = "issueType", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Issue> issues = new HashSet<>();

    @ManyToMany(mappedBy = "issues", fetch = FetchType.LAZY)
    Set<Product> products = new HashSet<>();
}