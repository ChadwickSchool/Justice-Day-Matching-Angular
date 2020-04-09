import { SaveOptionsService } from '../services/save-options.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  selectedOption: string;
  selectedOptionsArray: Array<string>;
  surveyName: string;
  hasSubmitted: boolean;

  constructor(private saveOptionService: SaveOptionsService) {
    this.surveyName = '';
  }

  ngOnInit() {
    this.hasSubmitted = false;
  }

  updateOptions(name: string) {
    this.selectedOption = name;
    this.selectedOptionsArray = new Array(parseInt(this.selectedOption, 10));
    // this.options.length = this.options.value;
  }
  refresh() {

  }
  submitOptions() {
    this.hasSubmitted = true;
    this.saveOptionService.addOptions(this.surveyName, 'test');
    // for (let i = 0; i < 50; i++) {
    //   this.saveOptionService.createData();
    // }
  }

  indexTracker(index: number, value: any) {
    return index;
  }
}
