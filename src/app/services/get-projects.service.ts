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

  getProjectNames(sessionNum: number, category: string) {
    const query = this.afs.collection<Projects>('projects', ref => ref
      .where('sessionNumber', '==', sessionNum)
      .where('category', '==', category));
    return query.valueChanges();
  }

   getProjectsByStudent(uid: string) {
    this.afs.collection<Projects>('projects').valueChanges().subscribe(project => {
      project.forEach(project => project.students.forEach(student => {
        if (student === uid) {
          this.projectNames.push(project.projectName);
        }
      }));
    });
  }
}
