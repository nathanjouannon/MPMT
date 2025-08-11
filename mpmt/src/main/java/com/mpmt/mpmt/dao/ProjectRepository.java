package com.mpmt.mpmt.dao;

import com.mpmt.mpmt.models.Project;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ProjectRepository extends CrudRepository<Project, Integer> {
    Optional<Project> findById(Long id);
}
