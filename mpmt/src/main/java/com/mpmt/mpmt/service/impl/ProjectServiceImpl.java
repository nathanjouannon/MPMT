package com.mpmt.mpmt.service.impl;

import com.mpmt.mpmt.dao.ProjectRepository;
import com.mpmt.mpmt.dao.UserRepository;
import com.mpmt.mpmt.dto.ProjectRequest;
import com.mpmt.mpmt.dto.UpdateProjectRequest;
import com.mpmt.mpmt.models.Project;
import com.mpmt.mpmt.models.User;
import com.mpmt.mpmt.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public Iterable<Project> getProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Project createProject(ProjectRequest request) {
        User owner = userRepository.findById(request.getOwner_id())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'id : " + request.getOwner_id()));

        Project project = new Project();

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStart_date());
        project.setOwner(owner);
        return projectRepository.save(project);
    }

    @Override
    public Project updateProject(UpdateProjectRequest request) {

        Project project = projectRepository.findById(request.getProject_id())
                .orElseThrow(() -> new RuntimeException(("La projet" + request.getProject_id() + "n'as pas été trouvé")));

        if (!request.getOwner_id().equals(project.getOwner().getId())) {
            User newOwner = userRepository.findById(request.getOwner_id())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'id : " + request.getOwner_id()));
            project.setOwner(newOwner);
        } else {
            project.setOwner(project.getOwner());
        }

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStart_date());
        project.setOwner(project.getOwner());
        return projectRepository.save(project);
    }

    @Override
    public void deleteProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException(("La projet" + projectId + "n'as pas été trouvé")));

        projectRepository.deleteById(projectId.intValue());
    }
}
