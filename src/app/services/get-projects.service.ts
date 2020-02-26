import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Projects } from '../shared/models/projects.model';

@Injectable({
  providedIn: 'root'
})
export class GetProjectsService {
  projectsRef: AngularFirestoreCollection<Projects>;
  projects: Observable<Projects[]>;
  projectNames: Array<string>;
  constructor(private afs: AngularFirestore) {
    this.projectsRef = afs.collection<Projects>('projects');
    this.projects = this.projectsRef.valueChanges();
    this.projectNames = [];
   }

  getProjects(uid: string) {
    this.afs.collection<Projects>('projects').valueChanges().subscribe(project => {
      project.forEach(project => project.students.forEach(student => {
        console.log(project);
        console.log(student);
        console.log(uid);
        if (student === uid) {
          console.log(project.projectName);
          this.projectNames.push(project.projectName);
          console.log('p', this.projectNames);
        }
      }));
    });
  }
}
