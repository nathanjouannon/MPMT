// src/app/components/project-drawer-member/project-drawer-member.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Project } from '../../pages/projects/projects.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-drawer-member',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-drawer-member.component.html',
  styleUrls: ['./project-drawer-member.component.scss']
})
export class ProjectDrawerMemberComponent {
  @Input() project: Project | null = null;
  @Output() updateProject = new EventEmitter<void>();

  showForm = false; // Contrôle l'affichage du formulaire
  addMemberForm: {
    userEmail: string,
    role: string
  } = {
    userEmail: "",
    role: ""
  };

  private apiUrl = "http://localhost:8080/api/project/addMember"

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  toggleForm() {
    this.showForm = !this.showForm;
  }

  onAddMember(form: NgForm) {
    if (!form.valid) {
      form.control.markAllAsTouched();
      return;
    }

    const payload = {
      userRequestingID: this.project?.owner.id,
      userEmail: this.addMemberForm.userEmail,
      projectId: this.project?.id,
      role: this.addMemberForm.role
    };

    this.http.post(this.apiUrl, payload).subscribe({
      next: () => {
        this.resetFormModel();
        this.toggleForm();
        this.toastr.success('Utilisateur ajouté avec succès');
        this.updateProject.emit();
      },
      error: (err) => {
        console.log(err)
        if (err.error && err.error.message) {
          this.toastr.error(err.error.message, 'Erreur');
        } else {
          this.toastr.error('Une erreur est survenue', 'Erreur');
        }
      }
    });
  }

  private resetFormModel() {
    this.addMemberForm = { userEmail: '', role: ''};
  }
}
