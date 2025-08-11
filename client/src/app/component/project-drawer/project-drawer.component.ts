import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../pages/projects/projects.component';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-project-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-drawer.component.html',
  styleUrl: './project-drawer.component.scss'
})
export class ProjectDrawerComponent {
  @Input() project: Project | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() projectUpdated = new EventEmitter<void>();
  @Output() projectDeleted = new EventEmitter<number>();

  editMode = false;
  editedProject = {
    name: '',
    description: '',
    start_date: '',
    owner_id: 0
  };

  private apiUrl = 'http://localhost:8080/api/project';

  constructor(private http: HttpClient) {}

  onBackdropClick() {
    this.close.emit();
  }

  editProject() {
    if (!this.project) return;
    this.editMode = true;

    // Pré-remplir avec les valeurs actuelles
    this.editedProject = {
      name: this.project.name,
      description: this.project.description,
      start_date: this.project.startDate?.slice(0, 16) || '', // format yyyy-MM-ddTHH:mm
      owner_id: this.project.owner?.id
    };
  }

  cancelEdit() {
    this.editMode = false;
  }

  onUpdateProject(form: NgForm) {
    if (!form.valid) {
      form.control.markAllAsTouched();
      return;
    }

    const payload = {
      project_id: this.project?.id,
      name: this.editedProject.name,
      description: this.editedProject.description,
      start_date: this.editedProject.start_date,
      owner_id: Number(this.editedProject.owner_id)
    };

    this.http.put(this.apiUrl, payload).subscribe({
      next: () => {
        this.editMode = false;
        this.projectUpdated.emit(); // pour rafraîchir la liste
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la mise à jour du projet');
      }
    });
  }

  createTask() {
    console.log("crée une tache")
  }

  addMember() {
    console.log("ajouter un membre"); 
  }

  deleteProject() {
  if (!this.project) return;

  const confirmation = confirm(`Voulez-vous vraiment supprimer le projet "${this.project.name}" ?`);
  if (!confirmation) return;

  this.http.delete(`${this.apiUrl}/${this.project.id}`).subscribe({
    next: () => {
      alert('Projet supprimé avec succès');
      this.close.emit();  // ferme le drawer après suppression
      // éventuellement émettre un event pour rafraîchir la liste des projets dans le parent
      this.projectDeleted.emit(this.project!.id);
    },
    error: (err) => {
      console.error(err);
      alert('Erreur lors de la suppression du projet');
    }
  });
}
}
