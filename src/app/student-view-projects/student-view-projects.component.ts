import { Component, OnInit } from '@angular/core';
import { GetProjectsService } from '../services/get-projects.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-student-view-projects',
  templateUrl: './student-view-projects.component.html',
  styleUrls: ['./student-view-projects.component.scss']
})
export class StudentViewProjectsComponent implements OnInit {
  userId: string;
  projects: Array<string>;
  constructor(private projectsService: GetProjectsService, private authService: AuthService) {
    this.userId = '';
    this.projects = [];
   }

  ngOnInit() {
    this.userId = this.authService.getFirebaseUserID();
    this.projectsService.getProjects(this.userId);
    this.projects = this.projectsService.projectNames;
  }

}
