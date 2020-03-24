let admin = require('firebase-admin');
let serviceAccount = require("../serviceAccountKey.json");
const arrayUnion = admin.firestore.FieldValue.arrayUnion;

let minGroupSize = 15;
let maxGroupSize = 30;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://social-justice-day.firebaseio.com'
  });

let studentdb = admin.firestore().collection("users");
let projectdb = admin.firestore().collection("projects");
let prefdb = admin.firestore().collection("choices");

// studentdb.get().then(function(querySnapshot){
//     querySnapshot.forEach(function(doc){
//         let student = doc.data();
//         console.log(student.name);
//         console.log(student.uid);
//     });
// });

// prefdb.get().then(function(querySnapshot){
//     querySnapshot.forEach(function(doc){
//         let pref = doc.data();
//         studentdb.where("uid", "==", pref.uid).get().then(function(querySnapshot){
//             querySnapshot.forEach(function(doc){
//                 let student = doc.data();
//                 console.log(student.name);
//             });
//             console.log(pref.ranking);
//         });
//     });
// });

//this one doesnt work
function getRawScore(projName){
    var i = 0;
    let projPrefs = prefdb.where("ranking", "array-contains", projName);
    projPrefs.get().then(function(querySnapshot){
        //I have tried using .size and .length instead of this for loop but it doenst work
        querySnapshot.forEach(function(doc){
            pref = doc.data();
            console.log(pref.uid);
            i = i+1;
        });
        console.log(i);
        //this part returns right score
    }); 
    return i;
    //this one doesnt
}

//this one doesnt work either
function getRawScore (projName) {
    return prefdb.where('ranking', 'array-contains', projName).get().then(q => q.size);
  }

// getRawScore("Test Project 3")
console.log(getRawScore("Test Project 3"));

//this one doesnt work either
function getPopScore(projName){
    let score = 0; 
    let projPrefs = prefdb.where('ranking', 'array-contains', projName);
    projPrefs.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let pref = doc.data();
            for(let i=0; i<5;i++){
                let currentPref = pref.ranking[i];
                console.log(currentPref);
                if(currentPref == projName){
                    score = score + (10-i);
                }
            }
        });
        console.log(score);
        //this part returns the right score
    });
    return score;
    //this part doesnt
}

// let test  = getPopScore("Test Project 7");
// console.log(test);


// //TODO FOR JACOB: make fields for project called popularityScore, rawScore, roomSize

// function updateRawScore(){
//     let projects = projectdb;
//     projects.get().then(function (querySnapshot) {
//         querySnapshot.forEach(function (proj) {
//             let projRScore = getRawScore(proj.projectName);
//             proj.rawScore = projRScore;
//             projectdb.doc(proj.id).update(proj);
//         });
//     });
// }

// function updatePopScore(){
//     let projects = projectdb;
//     projects.get().then(function (querySnapshot) {
//         querySnapshot.forEach(function (proj) {
//             let projPScore = getPopScore(proj.projectName);
//             proj.popScore = projPScore;
//             projectdb.doc(proj.id).update(proj);
//         });
//     });
// }

// function getUnderfilledGroups(){
//     let underfilledProjects:string[] = [];
//     let projects = projectdb.orderBy('rawScore');
//     projects = projectdb.where('rawScore', '<=', minGroupSize);
//     projects.get().then(function (querySnapshot) {
//         querySnapshot.forEach(function (proj) {
//             underfilledProjects.push(proj.projectName);
//         });
//     });
//     return underfilledProjects;
// }


// function giveAllPrefs(){
// //method to fill all groups with a raw score less than the required amount, starting from lowest score to highest
//     let underfilledProjs = getUnderfilledGroups();
//     let j = underfilledProjs.length;
//     //gets all projects with raw score < min group size (var declared at top)
//     for(let i = 0; i<j;i++){
//         let projName = underfilledProjs[i];
//         let proj = projectdb.doc('projectName', '==', projName);
//         let prefs = prefdb.where('rankings', 'array-contains', projName);
//         prefs.get().then(function (querySnapshot) {
//             querySnapshot.forEach(function (pref) {
//             //for every project in underfilled project, find specific preference doc to find student and set student to matched
//                 let studId = pref.uid;
//                 studentdb.doc('uid', '==', studId).get().then(function (student) {
//                     let studentName = student.name;
//                     student.matched = true; 
//                     studentdb.doc(student.id).update(student);
//                     proj.get.then(function (project) {
//                     //add each student name to list of students for each project
//                         project.students.push(studentName);
//                         projectdb.doc(project.id).update(project);
//                     });
//                 });
//             });
//         });
//     }
// }

// function giveNthPrefs(n){
// //method to give all nth preferences of students until max limit is reached, starting from lowest popularity score to highest
//     let projects = projectdb.orderBy('popScore');
//     //list of projects sorted by lowest popularity score
//     projects.get().then(function (querySnapshot){
//         querySnapshot.forEach(function (project){
//             let projectName = project.projectName;
//             if(project.students.length < maxGroupSize){
//                         //loop through every project and find prefs have ranked project as nth
//                 let prefs = prefdb.where('matched', "==", false);
//                 let nthPrefs = prefs.filter(function (p){
//                     return p.rankings[n] == projectName;
//                 });
//                 for(let i = 0; i < nthPrefs.length; i++){
//                     let pref = nthPrefs[i];
//                     let studId = pref.uid;
//                     studentdb.doc('uid', '==', studId).get().then(function (student) {
//                         if(student.matched == false){
//                             let studentName = student.name;
//                             student.matched = true; 
//                             studentdb.doc(student.id).update(student);
//                             project.get.then(function (project) {
//                             //add each student name to list of students for each project
//                             project.students.push(studentName);
//                             projectdb.doc(project.id).update(project);
//                             pref.matched = true;
//                             prefdb.doc(pref.id).update(pref);
//                             });
//                         }   
//                     });
//                 }
//             }
//         });
//     });
// }