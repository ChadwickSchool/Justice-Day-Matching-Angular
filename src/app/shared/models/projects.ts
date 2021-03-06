import { Projects } from './projects.model';
import { stringify } from 'querystring';

export default class ProjectsClass implements Projects {
    sessionNumber: number;
    category: string;
    projectName: string;
    zoomid: string;
    students: Array<string>;

    constructor(sessionNumber: number, category: string, projectName: string, zoomid: string, students: Array<string>) {
        this.sessionNumber = sessionNumber;
        this.category = category;
        this.projectName = projectName;
        this.zoomid = zoomid;
        this.students = students;
    }
}
