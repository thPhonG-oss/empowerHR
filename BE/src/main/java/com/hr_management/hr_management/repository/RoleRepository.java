package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role,String> {
    @Query(value = "SELECT r FROM Role r WHERE r.name=?1")
    Optional<Role> findByName(String role);

    boolean existsByName(String roleName);
}
