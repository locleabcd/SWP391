package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	boolean existsByUsername(String username); //JPA auto query SQL to check duplicated
												//Username when field is username -- UserName when field is "userName" caution
												boolean existsByEmail(String email);
	Optional<User> findByUsername(String username);

	Optional<User> findByEmail(String email);
}
