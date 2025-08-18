package com.mpmt.mpmt.service.impl;

import com.mpmt.mpmt.dao.ProjectMemberRepository;
import com.mpmt.mpmt.dao.ProjectRepository;
import com.mpmt.mpmt.dao.UserRepository;
import com.mpmt.mpmt.dto.ProjectMemberRequest;
import com.mpmt.mpmt.dto.ProjectRequest;
import com.mpmt.mpmt.dto.UpdateProjectRequest;
import com.mpmt.mpmt.errors.ForbiddenActionException;
import com.mpmt.mpmt.errors.ResourceNotFoundException;
import com.mpmt.mpmt.errors.UserAlreadyMemberException;
import com.mpmt.mpmt.models.Project;
import com.mpmt.mpmt.models.ProjectMember;
import com.mpmt.mpmt.models.ProjectMemberRole;
import com.mpmt.mpmt.models.User;
import com.mpmt.mpmt.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ProjectServiceImpl implements ProjectService {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectMemberRepository projectMemberRepository;

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

    @Override
    public ProjectMember addMember(ProjectMemberRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("le projet n'existe pas"));

        User requestingUser = userRepository.findById(request.getUserRequestingID())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur demandeur non trouvé"));

        boolean isOwner = project.getOwner().getId().equals(requestingUser.getId());
        if (!isOwner) {
            ProjectMember requesterMembership = projectMemberRepository
                    .findByProjectAndUser(project, requestingUser)
                    .orElseThrow(() -> new ForbiddenActionException("Vous n'êtes pas membre de ce projet"));

            if (requesterMembership.getRole() != ProjectMemberRole.ADMIN) {
                throw new ForbiddenActionException("Vous devez être ADMIN ou propriétaire pour ajouter un membre");
            }
        }

        User user = userRepository.findByEmail(request.getUserEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        if (projectMemberRepository.findByProjectAndUser(project, user).isPresent()) {
            throw new UserAlreadyMemberException("Cet utilisateur est déjà membre du projet");
        }

        ProjectMember projectMember = new ProjectMember();
        projectMember.setProject(project);
        projectMember.setUser(user);
        projectMember.setRole(request.getRole());
        projectMember.setJoinedAt(LocalDateTime.now());

        return projectMemberRepository.save(projectMember);
    }
}
