var db = firebase.firestore();
var studentdb = db.collection("students");
var projectdb = db.collection("projects");
var prefdb = db.collection("preferences");

studentdb.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id}`);
    })
});

studentdb.doc("M.Thornhill").set({
    fName: "Maya",
    lName: "Thornhill",
    email: "Maya@nisldoloremagna.eu",
    });
    studentdb.doc("A.Benitez").set({
    fName: "Annette",
    lName: "Benitez",
    email: "Annette@ataccumsan.com",
    });
    studentdb.doc("I.Staten").set({
    fName: "Ivory",
    lName: "Staten",
    email: "I.Staten@blanditeum.org",
    });
    studentdb.doc("O.Chambliss").set({
    fName: "Oscar",
    lName: "Chambliss",
    email: "Oscar@eumminim.eu",
    });
    studentdb.doc("N.Lachance").set({
    fName: "Nicole",
    lName: "Lachance",
    email: "N.Lachance@eadignissim.info",
    });
    studentdb.doc("M.Wise").set({
    fName: "Mitch",
    lName: "Wise",
    email: "Mitch.Wise@doloremagnanisl.net",
    });
    studentdb.doc("G.Lowell").set({
    fName: "Gonzalo",
    lName: "Lowell",
    email: "Gonzalo@erosdelenit.com",
    });
    studentdb.doc("E.Capps").set({
    fName: "Ezra",
    lName: "Capps",
    email: "Ezra.Capps@molestiezzril.net",
    });
    studentdb.doc("K.Arce").set({
    fName: "Kim",
    lName: "Arce",
    email: "K.Arce@nulladolor.gov",
    });
    studentdb.doc("M.Davison").set({
    fName: "Moises",
    lName: "Davison",
    email: "Moises.Davison@duisdelenitaugue.info",
    });
    studentdb.doc("R.Kovach").set({
    fName: "Robbie",
    lName: "Kovach",
    email: "Robbie.Kovach@ipsumduis.info",
    });
    studentdb.doc("L.Santos").set({
    fName: "Lawrence",
    lName: "Santos",
    email: "L.Santos@minimillum.com",
    });
    studentdb.doc("E.Benefield").set({
    fName: "Emma",
    lName: "Benefield",
    email: "E.Benefield@invulputateUtwisi.com",
    });
    studentdb.doc("S.Bowens").set({
    fName: "Sheryl",
    lName: "Bowens",
    email: "Sheryl@duisautem.eu",
    });
    studentdb.doc("G.Rawlins").set({
    fName: "Grace",
    lName: "Rawlins",
    email: "Grace.Rawlins@exfeugait.net",
    });
    studentdb.doc("L.Woodward").set({
    fName: "Lisa",
    lName: "Woodward",
    email: "Lisa@accumsanduis.edu",
    });
    studentdb.doc("B.Coleman").set({
    fName: "Beryl",
    lName: "Coleman",
    email: "Beryl@molestiehendrerit.us",
    });
    studentdb.doc("M.Pearl").set({
    fName: "Melanie",
    lName: "Pearl",
    email: "Melanie.Pearl@eatation.org",
    });
    studentdb.doc("D.Dowdy").set({
    fName: "Dara",
    lName: "Dowdy",
    email: "D.Dowdy@uteum.gov",
    });
    studentdb.doc("P.Collette").set({
    fName: "Paula",
    lName: "Collette",
    email: "Paula.Collette@minimvolutpat.info",
    });