package com.mpmt.mpmt.service;

import com.mpmt.mpmt.dto.ProjectMemberRequest;
import com.mpmt.mpmt.dto.ProjectRequest;
import com.mpmt.mpmt.dto.UpdateProjectRequest;
import com.mpmt.mpmt.models.Project;
import com.mpmt.mpmt.models.ProjectMember;

import java.util.Iterator;
import java.util.List;

public interface ProjectService {
    // Get All project
    Iterable<Project> getProjects();

    // create a project
    Project createProject(ProjectRequest request);

    // update a project
    Project updateProject(UpdateProjectRequest request);

    // Supprimer un projet
    void deleteProject(Long projectId);

    // Ajouter un membre a un projet
    ProjectMember addMember(ProjectMemberRequest request);
}
