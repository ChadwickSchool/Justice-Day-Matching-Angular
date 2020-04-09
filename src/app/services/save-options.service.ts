import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Options } from '../shared/models/options.model';
import OptionsClass from '../shared/models/options';
import ProjectsClass from '../shared/models/projects';
import { User } from '../shared/models/user.model';
import ChoiceClass from '../shared/models/choice';
import { Choice } from '../shared/models/choice.model';


@Injectable({
  providedIn: 'root'
})
export class SaveOptionsService {
  choicesRef: AngularFirestoreCollection<Choice>;
  optionsRef: AngularFirestoreCollection<Options>;
  options: Observable<Options[]>;
  students: Array<string>;
  category: string;
  name: string;
  constructor(private afs: AngularFirestore) {
    this.optionsRef = afs.collection<Options>('projects');
    this.choicesRef = afs.collection<Choice>('choices');
    this.options = this.optionsRef.valueChanges();
    this.students = [];
    this.category = '';
    this.name = '';
  }

  getChoices(): Observable<Options[]> {
    return this.options;
  }

  createData() {
    const randomString = Math.random().toString(36).slice(2).substring(0, 6);
    this.createUsers(randomString);
    this.createChoices(randomString);
  }

  createUsers(randomString: string) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${randomString}`
    );
    const data = {
      uid: randomString,
      name: randomString + ' name',
      email: randomString + '@gmail.com',
      isAdmin: false
    };

    return userRef.set(data, { merge: true });
  }

  createChoices(randomString: string) {
    for (let i = 1; i < 2; i++) {
    const id = this.afs.createId();
    const choices = [
      'Apex(' + i + ') Project ' + (Math.floor(Math.random() * 25) + 1),
      'Apex(' + i + ') Project ' + (Math.floor(Math.random() * 25) + 1),
      'Apex(' + i + ') Project ' + (Math.floor(Math.random() * 25) + 1),
      'Apex(' + i + ') Project ' + (Math.floor(Math.random() * 25) + 1),
      'Apex(' + i + ') Project ' + (Math.floor(Math.random() * 25) + 1)
    ];
    const newChoice = new ChoiceClass(
      id,
      randomString,
      'session' + i,
      choices
    );
    this.choicesRef.doc(id).set(Object.assign({}, newChoice));
    }
  }

  addOptions(surveyName: string, zoomid: string) {
    for (let i = 1; i < 26; i++) {
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
    if (i > 20) {
      this.category = 'category 5';
    }
    const id = this.afs.createId();
    this.name = surveyName + ' ' + i;
    let zoom = '';
    zoom = zoomid + i;
    const newRanking = new ProjectsClass(
      1,
      this.category,
      this.name,
      zoom,
      this.students
    );
    this.optionsRef.doc(id).set(Object.assign({}, newRanking));
    }
  }
}
