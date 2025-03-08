from fastapi import HTTPException, status

incorrect_auth_cred_exception= HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="incorrect authenticaiton credentials!"
        ) 

subscription_not_found = HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Subscription not found!"
)

already_exists_exception = HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, 
            detail="Data is Already exists!"
        )

not_found_exception = HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Data Not Found!"
        )

unauthorized_exception = HTTPException(
        status_code=403, 
        detail="Unauthorized to perform this action."
        )