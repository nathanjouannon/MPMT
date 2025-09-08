package com.mpmt.mpmt.dao;

import com.mpmt.mpmt.models.TaskHistory;
import org.springframework.data.repository.CrudRepository;

public interface TaskHistoryRepository extends CrudRepository<TaskHistory, Long> {
}
