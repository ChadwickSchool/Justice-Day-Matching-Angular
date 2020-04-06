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
async function getRawScore(projName){
    var i = 0;
    let projPrefs = prefdb.where("ranking", "array-contains", projName);
    await projPrefs.get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            pref = doc.data();
            i = i+1;
        });
    });
    return i;
}

// test getRawScore
// console.log(getRawScore("Test Project 3"));

async function getPopScore(projName){
    let score = 0; 
    let projPrefs = prefdb.where('ranking', 'array-contains', projName);
    await projPrefs.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let pref = doc.data();
            for(let i=0; i<5;i++){
                let currentPref = pref.ranking[i];
                if(currentPref == projName){
                    score = score + (10-i);
                }
            }
        });
    });
    return score;
}

//test getPopScore
// getPopScore("Test Project 7").then(test => {
//     console.log(test);
// });


async function updateRawScore(){
    let projects = projectdb.where("sessionNumber", "==", 2);
    await projects.get().then(function (querySnapshot) {
        querySnapshot.forEach(async function (doc) {
            let proj = doc.data();
            console.log(proj.projectName);
            // proj.rawScore = await getRawScore(proj.projectName);
            let project = projectdb.doc(proj.projectName);
            project.update({
                rawScore: await getRawScore(proj.projectName)
            })
            .then(function(){
                console.log(proj.projectName + " updated");
            })
            .catch(function(error){
                console.error("Error updating document: ", error);
            });
        });
    });
}

updateRawScore();

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