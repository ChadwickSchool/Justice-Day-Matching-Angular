import { Projects } from './projects.model';

export default class ProjectsClass implements Projects {
    sessionNumber: number;
    projectName: string;
    students: Array<string>;

    constructor(sessionNumber: number, projectName: string, students: Array<string>) {
        this.sessionNumber = sessionNumber;
        this.projectName = projectName;
        this.students = students;
    }
}
