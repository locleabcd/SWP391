package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Integer> {
    List<Blog> findByUser_username(String username);//Find BY + Entity in Blog + _ + Entity's attribute name joined

    List<Blog> findByTags_TagName(String tagName);

    boolean existsByBlogTitle(String blogTitle);
}
