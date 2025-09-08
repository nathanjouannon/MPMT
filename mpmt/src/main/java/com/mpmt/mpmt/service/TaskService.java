package com.mpmt.mpmt.service;

import com.mpmt.mpmt.dto.*;
import com.mpmt.mpmt.models.Task;
import com.mpmt.mpmt.models.TaskAssignment;

public interface TaskService {
    Task createTask(TaskRequest request);

    TaskAssignment assignTask(TaskAssignmentRequest request);

    Task updateTask(Long taskId, TaskUpdateRequest request);

    Iterable<Task> getAllTasks();
}
