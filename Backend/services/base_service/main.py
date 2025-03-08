"""
Entrypoint for the base service
"""
import sys
sys.path.append("..")
from app import create_app
from manage_user.manage_user_router import router as user
from user_check_by_email_id.user_check_by_email_id_router import router as user_check_by_email_id
from aimodels.aimodels_router import router as aimodels
from projects.projects_router import router as projects
main_router = {
    '/user': user,
    '/aimodels': aimodels,
    '/projects': projects,
    '/user_check_by_email_id': user_check_by_email_id,
}

app = create_app(main_router, root_path='/b')
