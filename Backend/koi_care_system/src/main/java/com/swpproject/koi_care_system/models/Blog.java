package com.swpproject.koi_care_system.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "blogs")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int blogId;

    @Column(name = "blog_title", nullable = false)
    String blogTitle;
    @Lob//Large Object
    @Column(name = "blog_content", nullable = false, columnDefinition = "TEXT")
    String blogContent;
    @Column(name = "blog_image", nullable = false)
    String blogImage;
    @Column(name = "blog_date", nullable = false)
    LocalDate blogDate;

    @ManyToMany
    @JoinTable(
            name = "blog_tags",
            joinColumns = @JoinColumn(name = "blog_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    Set<Tag> tags = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;


}
