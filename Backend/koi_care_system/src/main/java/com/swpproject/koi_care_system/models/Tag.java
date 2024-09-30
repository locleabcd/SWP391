package com.swpproject.koi_care_system.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int tagId;

    @Column(name = "tag_name", nullable = false)
    String tagName;

    @Column(name = "tag_description", nullable = false)
    String tagDescription;

    @ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
    Set<Blog> blogs = new HashSet<>();
}
