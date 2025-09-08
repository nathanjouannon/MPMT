-- Create the database schema and initial data
DROP DATABASE IF EXISTS mpmt;
CREATE DATABASE IF NOT EXISTS mpmt;
USE mpmt;

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PROJECTS
-- =========================
CREATE TABLE projects (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  owner_id BIGINT NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- =========================
-- PROJECT MEMBERS
-- =========================
CREATE TABLE project_members (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  project_id BIGINT NOT NULL,
  role ENUM('ADMIN', 'MEMBER', 'OBSERVER') NOT NULL DEFAULT 'MEMBER',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_member_project (user_id, project_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- =========================
-- TASKS
-- =========================
CREATE TABLE tasks (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  project_id BIGINT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  due_date DATE,
  end_date DATE,
  priority ENUM('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH') DEFAULT 'MEDIUM',
  status ENUM('BACKLOG', 'TODO', 'IN_PROGRESS', 'RETRO', 'DONE') DEFAULT 'TODO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- =========================
-- TASK ASSIGNMENTS
-- =========================
CREATE TABLE task_assignments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  task_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  UNIQUE KEY uq_task_assignment (task_id, user_id),
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- TASK HISTORY
-- =========================
CREATE TABLE task_history (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  task_id BIGINT NOT NULL,
  user_id BIGINT NULL,
  field_changed VARCHAR(100) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- NOTIFICATIONS
-- =========================
CREATE TABLE notifications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  type ENUM('TASK_ASSIGNED', 'TASK_UPDATED') NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- INVITATIONS
-- =========================
CREATE TABLE invitations (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  project_id BIGINT NOT NULL,
  email VARCHAR(100) NOT NULL,
  invited_by BIGINT NOT NULL,
  token VARCHAR(255) NOT NULL,
  status ENUM('PENDING', 'ACCEPTED', 'DECLINED') DEFAULT 'PENDING',
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (invited_by) REFERENCES users(id)
);


-- =========================
-- INSERT Users
-- =========================
INSERT INTO users (username, email, password) VALUES
('Nathan', 'nathan@gmail.com', '$2a$10$AAhBLe/mF/Ojob0q35RUReGQmKp84WEUzo8fk7OWVcQ0u9b3SldF2'), 
('Olivier', 'olivier@gmail.com', '$2a$10$AAhBLe/mF/Ojob0q35RUReGQmKp84WEUzo8fk7OWVcQ0u9b3SldF2');
-- Password = Password

-- =========================
-- INSERT Projects
-- =========================
INSERT INTO projects (name, description, start_date, owner_id) VALUES
('Projet Alpha', 'Gestion de tâches collaboratives', '2025-08-11T14:30:00', 1),
('Projet Beta', 'Application e-commerce', '2025-07-10T14:30:00', 2);

-- =========================
-- INSERT Project Members
-- =========================
INSERT INTO project_members (user_id, project_id, role) VALUES
(1, 1, 'ADMIN'),
(2, 1, 'MEMBER'),
(2, 2, 'ADMIN');

-- =========================
-- INSERT Tasks
-- =========================
INSERT INTO tasks (project_id, title, description, due_date, priority, status) VALUES
(1, 'Créer l’authentification', 'Développement du module login/signup', '2025-09-10T14:30:00', 'HIGH', 'TODO'),
(1, 'Configuration du backend', 'Configurer Spring Boot', '2025-07-10T14:30:00', 'MEDIUM', 'IN_PROGRESS'),
(2, 'Installer Angular', 'Préparer le frontend', '2025-07-10T14:30:00', 'LOW', 'TODO');

-- =========================
-- INSERT Task Assignments
-- =========================
INSERT INTO task_assignments (task_id, user_id) VALUES
(1, 1),
(1, 2),
(2, 2);

-- =========================
-- INSERT Task History
-- =========================
INSERT INTO task_history (task_id, user_id, field_changed, old_value, new_value) VALUES
(1, 1, 'status', 'TODO', 'IN_PROGRESS'),
(1, 2, 'priority', 'HIGH', 'MEDIUM');