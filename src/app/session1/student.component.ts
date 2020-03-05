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

/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  showChoices: boolean;

  todo = ['Loading...'];

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
    const val = await this.studentService.hasVoted('session1', this.userId);
    this.voted = await this.studentService.hasVoted('session1', this.userId);
  }

  showTasks() {
    const test = ['Pears', 'Papaya', 'Peach', 'Pineapple', 'Apple', 'Rasberry', 'Blueberry',
    'Salad', 'Cake', 'Cupcake'];
    this.showChoices = true;
    this.getOptionsService.getOptionsByName('session1').subscribe(options => {
      this.todo = options[0].tasks;
      test.forEach(e => {
        this.todo.push(e);
        // this.allOptions.push(e);
      });
      for (let i = 0; i < 5; i++) {
        this.todo1.push(this.todo[i]);
      }
      for (let i = 5; i < 10; i++) {
        this.todo2.push(this.todo[i]);
      }
      for (let i = 10; i < 15; i++) {
        this.todo3.push(this.todo[i]);
      }
      for (let i = 15; i < 20; i++) {
        this.todo4.push(this.todo[i]);
      }
      this.choices = [];
      for (let i = 0; i < 5; i++) {
        this.connectionList.push('choiceElement' + i);
        this.choices.push([]);
      }
    });
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
    this.saveChoiceService.addChoices(this.result, 'session1', this.userId);
    this.surveyVotersService.addSurveyVoters('session1', this.currentUser);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else if (event.currentIndex === 0) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

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
