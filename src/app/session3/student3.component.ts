import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDropList
} from '@angular/cdk/drag-drop';
import { SaveChoiceService } from '../services/save-choice.service';
import { GetOptionsService } from '../services/get-options.service';
import { Options } from '../shared/models/options.model';
import { take } from 'rxjs/operators';
import { SurveyVotersService } from '../services/survey-voters.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { User } from '../shared/models/user.model';
import { StudentService } from '../services/student.service';
import { GetProjectsService } from '../services/get-projects.service';

/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: 'app-student',
  templateUrl: './student3.component.html',
  styleUrls: ['./student3.component.scss']
})
export class StudentComponent3 implements OnInit {
  showChoices: boolean;

  todo = [];

  todo1 = [];

  todo2 = [];

  todo3 = [];

  todo4 = [];

  assignedChoices = [];

  choices = [];

  connectionList = ['todoElement1', 'todoElement2', 'todoElement3', 'todoElement4'];

  options: Options[];

  userId: string;

  currentUser: User;

  surveyName = '';
  voted: boolean;

  result: Array<string> = [];
  constructor(
    private saveChoiceService: SaveChoiceService,
    private getOptionsService: GetOptionsService,
    private projectsService: GetProjectsService,
    private surveyVotersService: SurveyVotersService,
    private userService: UserService,
    private authService: AuthService,
    private studentService: StudentService) {
    this.voted = false;
    this.userId = '';
    this.options = [];
  }

  ngOnInit(): void {
    this.showOptions();
    this.setUpUser();
    this.showTasks();
    this.showChoices = false;
  }

  async setUpUser() {
    this.userId = this.authService.getFirebaseUserID();
    this.currentUser = await this.userService.getCurrentUser(this.userId);
  }

  async showOptions() {
    this.options = await this.getOptionsService.getOptions().pipe(take(1)).toPromise();
  }

  async hasVoted() {
    const val = await this.studentService.hasVoted('session3', this.userId);
    this.voted = await this.studentService.hasVoted('session3', this.userId);
  }

  subscribeTo(i) {
    this.projectsService.getProjectNames(3, 'category ' + i).subscribe(projects => {
      projects.forEach(project => {
        this['todo' + i].push(project.projectName);
      });
    });
  }

  showTasks() {
    this.showChoices = true;

    for (let i = 0; i < 5; i++) {
      this.connectionList.push('choiceElement' + i);
      this.choices.push([]);
    }

    for (let i = 1; i < 5; i++) {
      this.subscribeTo(i);
    }
    this.hasVoted();
  }

  hasExtras() {
    for (let i = 0; i < this.choices.length; i++) {
      if (this.choices[i].length > 1) {
        return true;
      }
    }
    return false;
  }

  getAssignedChoices(event: CdkDragDrop<Array<string>>) {
    for (let i = 0; i < this.todo.length; i++) {
      this.todo[i] = this.assignedChoices[i];
    }
    this.getOptionsService.getOptions();
  }

  saveChoiceOrder(event: CdkDragDrop<Array<string>>) {
    for (let i = 0; i < this.choices.length; i++) {
      this.result[i] = this.choices[i][0];
    }
    this.saveChoiceService.addChoices(this.result, 'session3', this.userId);
    this.surveyVotersService.addSurveyVoters('session3', this.currentUser);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else if (event.currentIndex === 0 || event.container.id.startsWith('todoElement')) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (!event.container.id.startsWith('todoElement')) {
        while (this.hasExtras()) {
          for (let i = 0; i < this.choices.length; i++) {
            if (this.choices[i].length > 1) {
              if (i < this.choices.length - 1) {
                transferArrayItem(this.choices[i], this.choices[i + 1], 1, 0);
              } else {
                transferArrayItem(this.choices[i], this.todo, 1, 0);
              }
            }
          }
        }
      }
    }
  }
}
