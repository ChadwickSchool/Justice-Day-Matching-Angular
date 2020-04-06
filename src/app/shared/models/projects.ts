import { Projects } from './projects.model';

export default class ProjectsClass implements Projects {
    sessionNumber: number;
    category: string;
    projectName: string;
    students: Array<string>;

    constructor(sessionNumber: number, category: string, projectName: string, students: Array<string>) {
        this.sessionNumber = sessionNumber;
        this.category = category;
        this.projectName = projectName;
        this.students = students;
    }
}
