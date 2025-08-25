package com.mpmt.mpmt.controller;

import com.mpmt.mpmt.dto.TaskAssignmentRequest;
import com.mpmt.mpmt.dto.TaskRequest;
import com.mpmt.mpmt.dto.UpdateTaskPriorityRequest;
import com.mpmt.mpmt.dto.UpdateTaskStatusRequest;
import com.mpmt.mpmt.models.Task;
import com.mpmt.mpmt.models.TaskAssignment;
import com.mpmt.mpmt.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/task")
@CrossOrigin(origins = "*")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping("")
    public Task createTask(@RequestBody TaskRequest request) {
        return taskService.createTask(request);
    }

    @PatchMapping("/updatePriority")
    public Task updateTaskPriority(@RequestBody UpdateTaskPriorityRequest request) {
        return taskService.updateTaskPriority(request);
    }

    @PatchMapping("/updateStatus")
    public Task updateTaskStatus(@RequestBody UpdateTaskStatusRequest request) {
        return taskService.updateTaskStatus(request);
    }

    @PostMapping("/assign")
    public TaskAssignment assignTask(@RequestBody TaskAssignmentRequest request) {
        return taskService.assignTask(request);
    }

}
