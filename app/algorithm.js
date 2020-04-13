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
    let projects = projectdb;
    await projects.get().then(function (querySnapshot) {
        querySnapshot.forEach(async function (doc) {
            let proj = doc.data();
            let project = projectdb.doc(doc.id);
            project.update({
                rawScore: await getRawScore(proj.projectName)
            })
            .then(function(){
                console.log(proj.projectName + " raw score updated");
            })
            .catch(function(error){
                console.error("Error updating document: ", error);
            });
        });
    });
}

// updateRawScore();

async function updatePopScore(){
    let projects = projectdb;
    await projects.get().then(function (querySnapshot) {
        querySnapshot.forEach(async function (doc) {
            let proj = doc.data();
            let project = projectdb.doc(doc.id);
            project.update({
                popScore: await getPopScore(proj.projectName)
            })
            .then(function(){
                console.log(proj.projectName + " pop score updated");
            })
            .catch(function(error){
                console.error("Error updating document: ", error);
            });
        });
    });
}

// updatePopScore();

async function getUnderfilledGroups(){
    let underfilledProjects = [];
    let projects = projectdb.orderBy('rawScore');
    projects = projectdb.where('rawScore', '<=', minGroupSize);
    let querySnapshot = await projects.get();
    querySnapshot.forEach(async function (doc) {
        proj = doc.data();
        underfilledProjects.push(proj.projectName);
    });
    return underfilledProjects;
}

async function giveAllPrefs(){
//method to fill all groups with a raw score less than the required amount, starting from lowest score to highest
    let underfilledProjs = await getUnderfilledGroups();
    let j = underfilledProjs.length;
    console.log('underfilled length: ' + j);
    // gets all projects with raw score < min group size (var declared at top)
    for(let i = 0; i<j;i++){
        let projName = underfilledProjs[i];
        console.log('current project ' + projName);
        let proj = await projectdb.where('projectName', '==', projName);
        let projectGet = await proj.get();
        let projectStudents = [];
        let currentId;

        await projectGet.forEach(async (item) => {
            let data = await item.data();
            currentId = item.id;
            projectStudents = projectStudents.concat(data.students);
        });
        let prefs = await prefdb.where('ranking', 'array-contains', projName);
        prefs.get().then(function (querySnapshot) {
            querySnapshot.forEach(async function (doc) {
            //for every project in underfilled project, find specific preference doc to find student and set student to matched
                let pref = doc.data();
                let studId = pref.uid;
                await studentdb.doc(studId).get().then(async function (doc) {
                    let student = await doc.data();
                    if(student.matched == false){
                        let studentObj = studentdb.doc(doc.id);

                        studentObj.update({
                            matched: true
                        })
                        .then(function(){
                            console.log(student.name + " matched");
                        })
                        .catch(function(error){
                            console.error("Error matching student: ", error);
                        });
                        projectStudents.push(student.name);
                        let project = projectdb.doc(currentId);
                        project.update({
                            students: projectStudents
                        })
                        .then(function(){
                            console.log(student.name + " matched to project " + projName);
                        })
                        .catch(function(error){
                            console.error("Error matching student: ", error);
                        });
                    }
                });
            });
        });
    }
}


async function giveNthPrefs(n){
//method to give all nth preferences of students until max limit is reached, starting from lowest popularity score to highest
    let projects = await projectdb.orderBy('popScore');
    //list of projects sorted by lowest popularity score
    await projects.get().then(function (querySnapshot){
        querySnapshot.forEach(async function (doc){
            let project = await doc.data();
            let currentId = await doc.id;
            let projectName = project.projectName;
            console.log("current project: " + projectName);
            let projectStudents = project.students; 
            console.log("current groupsize: " + projectStudents.length)
                        //loop through every project and find prefs have ranked project as nth
                let prefs = await prefdb.where('ranking', "array-contains", projectName);
                let nthPrefs = [];
                await prefs.get().then(function (querySnapshot){
                    querySnapshot.forEach(async function (doc){
                        let pref = await doc.data();
                        if(pref.ranking[n] == projectName){
                            nthPrefs.push(pref.uid);
                        }
                    });
                });
                for(let i = 0; i < await nthPrefs.length; i++){
                    let studId = nthPrefs[i];
                    await studentdb.doc(studId).get().then(async function (doc) {
                        let student = await doc.data()
                        if(student.matched == false && projectStudents.length < maxGroupSize){
                            let studentObj = await studentdb.doc(doc.id);
                            studentObj.update({
                                matched: true
                            })
                            .then(function(){
                                console.log(student.name + " matched");
                            })
                            .catch(function(error){
                                console.error("Error matching student: ", error);
                            });
                            projectStudents.push(student.name);
                            let project = await projectdb.doc(currentId);
                            project.update({
                                students: projectStudents
                            })
                            .then(function(){
                                console.log(student.name + " matched to project " + " as preference: " + n);
                            })
                            .catch(function(error){
                                console.error("Error matching student: ", error);
                            });
                        }   
                    });
                }
        });
    });
}

async function clearProjects(){
    await projectdb.get().then(function(querySnapshot) {
        querySnapshot.forEach(async function (doc) {
            let project = await projectdb.doc(doc.id);
            project.update({
                students: []
            })
            .then(function(){
                console.log("project cleared: " + doc.data().projectName);
            })
            .catch(function(error){
                console.error("Error clearing project: ", error);
            });
        });
    });
}

async function setMatchedFalse(){
    await studentdb.get().then(function(querySnapshot) {
        querySnapshot.forEach(async function (doc) {
            let student = await studentdb.doc(doc.id);
            student.update({
                matched: false
            })
            .then(function(){
                console.log("Student unmatched: " + doc.data().name);
            })
            .catch(function(error){
                console.error("Error unmatching student:  ", error);
            });
        });
    });
}

// clearProjects();
// setMatchedFalse();
// updateRawScore();
// updatePopScore();
// giveAllPrefs();
// for(let i = 0; i < 4; i++){
//     giveNthPrefs(i);
// }
