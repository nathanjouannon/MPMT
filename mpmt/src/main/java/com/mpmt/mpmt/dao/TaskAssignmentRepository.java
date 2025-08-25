package com.mpmt.mpmt.dao;

import com.mpmt.mpmt.models.Task;
import com.mpmt.mpmt.models.TaskAssignment;
import com.mpmt.mpmt.models.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface TaskAssignmentRepository extends CrudRepository<TaskAssignment, Long> {
    Optional<TaskAssignment> findByTaskAndUser(Task task, User user);
}
