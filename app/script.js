$(document ).ready(function() {

    //get all the data on app startup
    $('#newStudent').click(function(){
        $('.studentForm').css("display", "block");
        $('#dynamicBtn').text('Save Changes')
    });

    $('#dynamicBtn').click(function(){
        //employee form values
        var fname = $("#fname").val();
        var lname = $("#lname").val();
        var email = $("#email").val();

        //check if you need to create or update an employee
        if($(this).text() == "Save Changes"){
            var docuName = fname.charAt(0)+"."+lname;
            db.collection("students").doc(docuName).set({
                fName:fname,
                lName: lname,
                email: email
            }).then(function(docRef) {
                $('#operationStatus').html('<div class="alert alert-success"><strong>Success!</strong> Student was created!</div>').delay(2500).fadeOut('slow');
                $('.studentForm').css("display", "none");
           }).catch(function(error) {
            $('#operationStatus').html('<div class="alert alert-danger"><strong>Error!</strong> Student was not created!</div>').delay(2500).fadeOut('slow');
        });
        }
        else{
            var docuName = fname.charAt(0)+"."+lname;
            var sfDocRef = db.collection("students").doc(docuName);
            sfDocRef.set({
                fName:fname,
                lName: lname,
                email: email
            },
            {
                merge: true
            }).then(function(docRef) {
                $('#operationStatus').html('<div class="alert alert-success"><strong>Success!</strong> Student was edited!</div>').delay(2500).fadeOut('slow');
                $('.studentForm').css("display", "none");
           }).catch(function(error) {
            $('#operationStatus').html('<div class="alert alert-danger"><strong>Error!</strong> Student was not edited!</div>').delay(2500).fadeOut('slow');
        });
        }
    });

    // Cancel the Employee form
    $('#cancel').click(function(){
        $('.studentForm').css("display", "none");
    });

    // Get the data of the employee you want to edit
    $("tbody.tbodyData").on("click","td.editStudent", function(){
        $('.studentForm').css("display", "block");
        $('#dynamicBtn').text('Update Student');

        $("#fname").val($(this).closest('tr').find('.fname').text());
        $("#lname").val($(this).closest('tr').find('.lname').text());
        $("#email").val($(this).closest('tr').find('.email').text());
    });

    // Delete employee
    $("tbody.tbodyData").on("click","td.deleteStudent", function(){
        //Get the Employee Data
        var fName = $(this).closest('tr').find('.fname').text(); //First Name
        var lName = $(this).closest('tr').find('.lname').text(); //Last Name
        var docuName = fName.charAt(0)+"."+lName;
        db.collection("students").doc(docuName).delete().then(function() {
            $('#operationStatus').html('<div class="alert alert-success"><strong>Success!</strong> Student was deleted.</div>').delay(2500).fadeOut('slow');
        }).catch(function(error) {
            $('#operationStatus').html('<div class="alert alert-danger"><strong>Failure!</strong> Student was not deleted.</div>').delay(2500).fadeOut('slow');
        });
    });


});