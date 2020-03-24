$(document).ready(function() {
            $('#onlyMalesFilter').click(function(){
                studentdb.where("gender","==","Male")
                .onSnapshot(function(querySnapshot){
                    LoadTableData(querySnapshot);
                });
            });

            $('#fullTimeFilter').click(function(){
                studentdb.where("isFullTime","==",true)
                .onSnapshot(function(querySnapshot){
                    LoadTableData(querySnapshot);
                });
            });

            $('#olderThenFilter').click(function(){
                studentdb.where("age",">=",30)
                .onSnapshot(function(querySnapshot){
                    LoadTableData(querySnapshot);
                });
            });

            $('#ageBetweenFilter').click(function(){
                studentdb.where("age",">=",30).where("age", "<=", 50)
                .onSnapshot(function(querySnapshot){
                    LoadTableData(querySnapshot);
                });
            });

            $('#yearsOfExperienceFilter').click(function(){
                studentdb.where("gender","==","Female")
                studentdb.where("yearsOfExperience", ">=", 5).where("yearsOfExperience", "<=", 10)
                .onSnapshot(function(querySnapshot){
                    LoadTableData(querySnapshot);
                });
            });

            $('#clearFilter').click(function(){
                studentdb.orderBy("age","desc").limit(5).get().then(function(querySnapshot){
                    LoadTableData(querySnapshot);
                });
            });
            $("#searchStudent" ).change(function() {
                var searchValue = $(this).val();
                studentdb.where("fName", "==", searchValue)
                    .onSnapshot(function(querySnapshot){
                        LoadTableData(querySnapshot)
                    });
              });
});


db.collection("students").onSnapshot(function(snapShot) {
    snapShot.docChanges().forEach(function(change){
        if(change.type === "added"){
            console.log("student added");
        }
        if(change.type === "modified"){
            console.log("student modified");
        }
        if(change.type === "removed"){
            console.log("student removed");
        }
    });
    LoadTableData(snapShot);
});

function LoadTableData(querySnapshot){
    var tableRow='';
    querySnapshot.forEach(function(doc) {
        var document = doc.data();
        tableRow +='<tr>';
        tableRow += '<td class="fname">' + document.fName + '</td>';
        tableRow += '<td class="lname">' + document.lName + '</td>';
        tableRow += '<td class="email">' + document.email + '</td>';
        tableRow += '<td class="editStudent"><i class="fa fa-pencil" aria-hidden="true" style="color:green"></i></td>'
        tableRow += '<td class="deleteStudent"><i class="fa fa-trash" aria-hidden="true" style="color:red"></i></td>'
        tableRow += '</tr>';
    });
    $('tbody.tbodyData').html(tableRow);
}