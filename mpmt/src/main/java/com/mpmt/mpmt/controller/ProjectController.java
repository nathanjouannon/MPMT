package com.mpmt.mpmt.controller;

import com.mpmt.mpmt.dto.ProjectMemberRequest;
import com.mpmt.mpmt.dto.ProjectRequest;
import com.mpmt.mpmt.dto.UpdateProjectRequest;
import com.mpmt.mpmt.models.Project;
import com.mpmt.mpmt.models.ProjectMember;
import com.mpmt.mpmt.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/project")
@CrossOrigin(origins = "*")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @GetMapping("")
    public Iterable<Project> getProjects() {
        return projectService.getProjects();
    }

    @PostMapping("")
    public Project createProject(@RequestBody ProjectRequest request) {
        return projectService.createProject(request);
    }

    @PutMapping("")
    public Project updateProject(@RequestBody UpdateProjectRequest request) {
        return projectService.updateProject(request);
    }

    @DeleteMapping("{project_id}")
    public void deleteProject(@PathVariable("project_id") Long project_id) {
        projectService.deleteProject(project_id);
    }

    @PostMapping("/addMember")
    public ProjectMember addProjectMember(@RequestBody ProjectMemberRequest request) {
        return projectService.addMember(request);
    }
}
