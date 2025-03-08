import firebase_admin
from firebase_admin import auth

firebase_admin.initialize_app()
from fastapi import HTTPException, Request, status

def get_current_user(req: Request):
    try:
    
        token = req.headers["Authorization"].split(' ').pop()
        # print(f'token:{token}')
        user = auth.verify_id_token(token)
        # print(f'user:{user}')
        return user['uid']
    except Exception as e:
        print(f'Error in token validation:{e}')
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect Authenticaiton credentials"
        ) 