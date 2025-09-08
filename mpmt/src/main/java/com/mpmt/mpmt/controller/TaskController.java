package com.mpmt.mpmt.controller;

import com.mpmt.mpmt.dto.*;
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


    @PostMapping("/assign")
    public TaskAssignment assignTask(@RequestBody TaskAssignmentRequest request) {
        return taskService.assignTask(request);
    }

    @PatchMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody TaskUpdateRequest request) {
        return taskService.updateTask(id, request);
    }

    @GetMapping("")
    public Iterable<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

}
