package com.mpmt.mpmt.service;

import com.mpmt.mpmt.dto.TaskAssignmentRequest;
import com.mpmt.mpmt.dto.TaskRequest;
import com.mpmt.mpmt.dto.UpdateTaskPriorityRequest;
import com.mpmt.mpmt.dto.UpdateTaskStatusRequest;
import com.mpmt.mpmt.models.Task;
import com.mpmt.mpmt.models.TaskAssignment;

public interface TaskService {
    Task createTask(TaskRequest request);

    Task updateTaskPriority(UpdateTaskPriorityRequest request);

    Task updateTaskStatus(UpdateTaskStatusRequest request);

    TaskAssignment assignTask(TaskAssignmentRequest request);
}
