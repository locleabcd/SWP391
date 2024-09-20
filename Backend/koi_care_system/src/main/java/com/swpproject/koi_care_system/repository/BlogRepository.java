package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.Blog;
import com.swpproject.koi_care_system.models.Tag;
import com.swpproject.koi_care_system.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Integer> {

    boolean existsByBlogTitle(String blogTitle);

    List<Blog> findByTags(Tag tag);

    List<Blog> findByUser(User user);

    List<Blog> findByBlogTitleContaining(String keyword);
}
