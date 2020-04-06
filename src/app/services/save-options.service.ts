import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Options } from '../shared/models/options.model';
import OptionsClass from '../shared/models/options';
import ProjectsClass from '../shared/models/projects';
import { User } from '../shared/models/user.model';


@Injectable({
  providedIn: 'root'
})
export class SaveOptionsService {
  optionsRef: AngularFirestoreCollection<Options>;
  options: Observable<Options[]>;
  students: Array<string>;
  category: string;
  name: string;
  constructor(private afs: AngularFirestore) {
    this.optionsRef = afs.collection<Options>('projects');
    this.options = this.optionsRef.valueChanges();
    this.students = [];
    this.category = '';
    this.name = '';
  }

  getChoices(): Observable<Options[]> {
    return this.options;
  }

  addOptions(surveyName: string) {
    for (let i = 1; i < 21; i++) {
    this.category = 'category 1';
    if (i > 5) {
      this.category = 'category 2';
    }
    if (i > 10) {
      this.category = 'category 3';
    }
    if (i > 15) {
      this.category = 'category 4';
    }
    const id = this.afs.createId();
    this.name = surveyName + ' ' + i;
    const newRanking = new ProjectsClass(
      2,
      this.category,
      this.name,
      this.students
    );
    this.optionsRef.doc(id).set(Object.assign({}, newRanking));
    }
  }
}
