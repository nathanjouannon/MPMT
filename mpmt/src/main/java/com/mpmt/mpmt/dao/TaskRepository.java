package com.mpmt.mpmt.dao;

import com.mpmt.mpmt.models.Task;
import org.springframework.data.repository.CrudRepository;

public interface TaskRepository extends CrudRepository<Task, Long> {
}
