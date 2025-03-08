from google.cloud import firestore
from firebase_admin import auth
from fastapi import HTTPException,status
from config import get_project_id

project_id= get_project_id()
db=firestore.Client(project=project_id)

contact_us_exception = HTTPException(
            status_code= status.HTTP_404_NOT_FOUND,
            detail= "There is some problem with this Email. Please contact support")
    
user_ref = db.collection(u'users')
def is_user_exists_or_not_in_firebase(email_id):
    try:
        user = auth.get_user_by_email(email_id)
        user_exists=True
        return user_exists, user.uid
    except Exception:
        user_exists=False
        return user_exists, None

def is_user_existes_or_not_in_firestore(email_id):
    
    query = user_ref.where(u'email', u'==', email_id).get()
    if query:
        user_exists=True
        return user_exists, query[0].to_dict()
    else:
        user_exists=False
        return user_exists, None
    
def check_user_or_not(email_id):
    
    email_id = email_id.lower().strip()
    
    firebase_user, _ = is_user_exists_or_not_in_firebase(email_id)
    
    firestore_user, _ = is_user_existes_or_not_in_firestore(email_id)

    if firestore_user==False and firebase_user==True:
        user_exists=False
        
    elif firestore_user==False and firebase_user==False:
        user_exists=False
        
    elif firebase_user==True and firestore_user==True:
        user_exists=True

    elif firestore_user==True and firebase_user==False:
        raise contact_us_exception
    else:
        raise HTTPException(
            status_code= status.HTTP_404_NOT_FOUND,
            detail= "Something went wrong")
    return {'is_exists': user_exists}

def user_exists_or_not(email_id):
    
    firebase_user, _ = is_user_exists_or_not_in_firebase(email_id)
    
    firestore_user, _ = is_user_existes_or_not_in_firestore(email_id)

    if firebase_user==True and firestore_user==True:
        user_exists=True
    else:
        user_exists=False
    
    return {'is_exists': user_exists}
