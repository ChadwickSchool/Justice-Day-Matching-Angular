import barnum
import random

def create_student_db_obj():
    for i in range(20):
        fName, lName = barnum.create_name()
        email = barnum.create_email(name=(fName, lName))
        print('studentdb.doc("%s.%s").set({' %(fName[0],lName))
        print('fName: "%s",' %(fName))
        print('lName: "%s",' %(lName))
        print('email: "%s",' %(email))
        print('});')

create_student_db_obj()