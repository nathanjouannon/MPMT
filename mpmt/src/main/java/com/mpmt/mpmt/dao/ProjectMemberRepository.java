package com.mpmt.mpmt.dao;

import com.mpmt.mpmt.models.Project;
import com.mpmt.mpmt.models.ProjectMember;
import com.mpmt.mpmt.models.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ProjectMemberRepository extends CrudRepository<ProjectMember, Integer> {
    Optional<ProjectMember> findById(Long id);
    Optional<ProjectMember> findByProjectAndUser(Project project, User user);
}
