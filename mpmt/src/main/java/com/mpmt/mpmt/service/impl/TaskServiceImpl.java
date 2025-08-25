package com.mpmt.mpmt.service.impl;

import com.mpmt.mpmt.dao.*;
import com.mpmt.mpmt.dto.TaskAssignmentRequest;
import com.mpmt.mpmt.dto.TaskRequest;
import com.mpmt.mpmt.dto.UpdateTaskPriorityRequest;
import com.mpmt.mpmt.dto.UpdateTaskStatusRequest;
import com.mpmt.mpmt.errors.ForbiddenActionException;
import com.mpmt.mpmt.errors.ResourceNotFoundException;
import com.mpmt.mpmt.errors.UserAlreadyAssignException;
import com.mpmt.mpmt.models.*;
import com.mpmt.mpmt.service.EmailService;
import com.mpmt.mpmt.service.NotificationService;
import com.mpmt.mpmt.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TaskServiceImpl implements TaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectMemberRepository projectMemberRepository;
    @Autowired
    private TaskAssignmentRepository taskAssignmentRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private NotificationService notificationService;

    @Override
    public Task createTask(TaskRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé"));

        User requestingUser = userRepository.findById(request.getUserRequestingId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur demandeur non trouvé"));

        // Vérifier si OWNER
        boolean isOwner = project.getOwner().getId().equals(requestingUser.getId());

        // Sinon vérifier si membre (ADMIN ou MEMBER)
        boolean hasPermission = false;
        if (!isOwner) {
            ProjectMember membership = projectMemberRepository
                    .findByProjectAndUser(project, requestingUser)
                    .orElseThrow(() -> new ForbiddenActionException("Vous n'êtes pas membre de ce projet"));

            if (membership.getRole() == ProjectMemberRole.ADMIN || membership.getRole() == ProjectMemberRole.MEMBER) {
                hasPermission = true;
            }
        }

        if (!isOwner && !hasPermission) {
            throw new ForbiddenActionException("Seuls les ADMIN et MEMBER peuvent créer une tâche");
        }

        Task task = new Task();
        task.setProject(project);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setEndDate(request.getEndDate());
        task.setPriority(request.getPriority() != null ? request.getPriority() : TaskPriority.LOW);
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.BACKLOG);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    @Override
    public Task updateTaskPriority(UpdateTaskPriorityRequest request) {
        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Tâche non trouvée"));

        Project project = task.getProject();
        User requestingUser = userRepository.findById(request.getUserRequestingId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur demandeur non trouvé"));

        boolean isOwner = project.getOwner().getId().equals(requestingUser.getId());
        if (!isOwner) {
            ProjectMember requesterMembership = projectMemberRepository
                    .findByProjectAndUser(project, requestingUser)
                    .orElseThrow(() -> new ForbiddenActionException("Vous n'êtes pas membre de ce projet"));

            if (requesterMembership.getRole() == ProjectMemberRole.OBSERVER) {
                throw new ForbiddenActionException("Les observateurs ne peuvent pas modifier la priorité d’une tâche");
            }
        }

        task.setPriority(request.getPriority());
        task.setUpdatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    @Override
    public Task updateTaskStatus(UpdateTaskStatusRequest request) {
        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Tâche non trouvée"));

        Project project = task.getProject();
        User requestingUser = userRepository.findById(request.getUserRequestingId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur demandeur non trouvé"));

        boolean isOwner = project.getOwner().getId().equals(requestingUser.getId());
        if (!isOwner) {
            ProjectMember requesterMembership = projectMemberRepository
                    .findByProjectAndUser(project, requestingUser)
                    .orElseThrow(() -> new ForbiddenActionException("Vous n'êtes pas membre de ce projet"));

            if (requesterMembership.getRole() == ProjectMemberRole.OBSERVER) {
                throw new ForbiddenActionException("Les observateurs ne peuvent pas modifier le statut d’une tâche");
            }
        }

        task.setStatus(request.getStatus());
        task.setUpdatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    @Override
    public TaskAssignment assignTask(TaskAssignmentRequest request) {
        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Tâche non trouvée"));

        Project project = task.getProject();

        User requestingUser = userRepository.findById(request.getUserRequestingId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur demandeur non trouvé"));

        // Vérifier si le demandeur est autorisé (owner ou membre ADMIN/MEMBER)
        boolean isOwner = project.getOwner().getId().equals(requestingUser.getId());
        if (!isOwner) {
            ProjectMember requesterMembership = projectMemberRepository
                    .findByProjectAndUser(project, requestingUser)
                    .orElseThrow(() -> new ForbiddenActionException("Vous n'êtes pas membre de ce projet"));

            if (requesterMembership.getRole() == ProjectMemberRole.OBSERVER) {
                throw new ForbiddenActionException("Les observateurs ne peuvent pas assigner une tâche");
            }
        }

        // Vérifier si l’utilisateur à assigner existe par email
        User userToAssign = userRepository.findByEmail(request.getUserEmailToAssign())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur à assigner non trouvé"));

        // Vérifier s’il est bien membre du projet
        projectMemberRepository.findByProjectAndUser(project, userToAssign)
                .orElseThrow(() -> new ForbiddenActionException("L'utilisateur à assigner doit être membre du projet"));

        // Vérifier si déjà assigné
        if (taskAssignmentRepository.findByTaskAndUser(task, userToAssign).isPresent()) {
            throw new UserAlreadyAssignException("Cet utilisateur est déjà assigné à cette tâche");
        }

        // Création de l'assignation
        TaskAssignment taskAssignment = new TaskAssignment();
        taskAssignment.setTask(task);
        taskAssignment.setUser(userToAssign);

        // --- ENVOI EMAIL DE NOTIFICATION ---
        // TODO: faire fonctionner (erreur:  Couldn't connect to host, port: \"live.smtp.mailtrap.io\", 2525;)
//        String subject = "Nouvelle tâche assignée : " + task.getTitle();
//        String body = String.format(
//                "Bonjour %s,\n\nVous avez été assigné à la tâche \"%s\" du projet \"%s\".\n\nDescription : %s\nDate limite : %s\n\nBonne continuation,\nL'équipe MPMT",
//                userToAssign.getUsername(),
//                task.getTitle(),
//                project.getName(),
//                task.getDescription() != null ? task.getDescription() : "Aucune description",
//                task.getDueDate() != null ? task.getDueDate().toString() : "Non définie"
//        );
//        emailService.sendEmail(userToAssign.getEmail(), subject, body);

        // --- ENREGISTRER UNE NOTIFICATION ---
        notificationService.createNotification(
                userToAssign,
                "TASK_ASSIGNMENT",
                "Vous avez été assigné à la tâche \"" + task.getTitle() + "\""
        );

        return taskAssignmentRepository.save(taskAssignment);
    }

}
