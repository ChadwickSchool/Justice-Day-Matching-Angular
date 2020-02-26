import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentViewProjectsComponent } from './student-view-projects.component';

describe('StudentViewProjectsComponent', () => {
  let component: StudentViewProjectsComponent;
  let fixture: ComponentFixture<StudentViewProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentViewProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentViewProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
