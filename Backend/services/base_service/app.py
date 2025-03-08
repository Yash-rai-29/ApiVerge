"""
Entrypoint for the base service
"""

import json
import os
from uuid import uuid4
import contextvars
import backoff
import structlog
import uvicorn
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response
from starlette.exceptions import HTTPException as StarletteHTTPException
from structlog.contextvars import clear_contextvars, bind_contextvars


from config import get_config_sm, get_local_config, get_config
from environment import get_environment, Environment
from logconfig import configure_logging, get_logger

cloud_trace_context = contextvars.ContextVar('cloud_trace_context', default='')
http_request_context = contextvars.ContextVar('http_request_context', default=dict({}))

@backoff.on_exception(backoff.expo, Exception, max_tries=3, base=2, factor=5)
def create_app(routers, root_path=''):
    env = get_environment()
    configure_logging(env)
    logger = get_logger()

    fastapi_app = FastAPI(openapi_url= f"{root_path}/openapi.json")
    for key in routers:
        fastapi_app.include_router(routers[key], prefix= f"{root_path}{key}")
        
    @fastapi_app.on_event("startup")
    async def app_startup():
        """r
        Things that should happen on app startup are defined here
        """

    @fastapi_app.get("/", response_class=HTMLResponse, include_in_schema=False)
    async def home():
        return """
         <html>
            <head>
                <title>Base API</title>
            </head>
            <body>
                <p>OpenAPI docs: <a href="/redoc">Link</a></p>
            </body>
        </html>
        """

    @fastapi_app.exception_handler(Exception)
    async def unhandled_exception_handler(request, exc: Exception):
        request_logger = logger.bind(
            request_method=request.method,
            request_uri=request.url.path,
            request_params=request.query_params,
        )
        request_id = getattr(request.state, "request_id", None)
        request_logger.exception(
            "Error occurred when processing the request",
            exception=exc,
            request_id=request_id,
        )
        return JSONResponse(
            {
                "error": "Internal server error",
                "requestId": request_id,
            },
            status_code=500,
        )

    @fastapi_app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request, exc):
        headers = getattr(exc, "headers", None)
        if headers:
            return JSONResponse(
                {"error": exc.detail}, status_code=exc.status_code, headers=headers
            )
        else:
            return JSONResponse({"error": exc.detail}, status_code=exc.status_code)

    @fastapi_app.middleware("http")
    async def log_requests(request: Request, call_next):
        """
        This middleware logs all requests and responses that come through.

        Each request is associated with a `request_id`, which is a UUID. `request_id` can be
        used to correlate logs throughout the system.

        """
        log = structlog.get_logger()
        clear_contextvars()
        request_id = str(uuid4())
        request.state.request_id = request_id
        bind_contextvars(request_id=request_id)
        response = await call_next(request)
        response.headers['Cache-Control']= 'no-store'


        if 200 <= response.status_code < 400:
            log.info(
                "Response OK",
                request_method=request.method,
                request_uri=request.url.path,
                request_params=request.query_params,
                request_id=request_id,
                status_code=response.status_code,
            )
            return response
        else:
            binary = b""
            async for data in response.body_iterator:
                binary += data
            body = binary.decode()
            # if 'x-cloud-trace-context' in request.headers:
            trace_header = request.headers.get('x-cloud-trace-context')
            log.warning(
                "Response NOT OK",
                request_method=request.method,
                request_uri=request.url.path,
                request_params=request.query_params,
                request_id=request_id,
                status_code=response.status_code,
                response_body=body,
                trace_context = trace_header
            )
            try:
                json_body = json.loads(body)
                json_body["requestId"] = request_id
                response = JSONResponse(content=json_body, status_code=response.status_code)
            except Exception:
                response = Response(content=body, status_code=response.status_code)
            response.headers['Cache-Control']= 'no-store'
            return response
    

    if env == Environment.development:
        allowed_origins_config = ["http://localhost:8080", "http://localhost:5173"]
    else:
        response = get_config_sm('allowed-origins')
        allowed_origins_config = response.payload.data.decode("UTF-8")
        allowed_origins_config = allowed_origins_config.split(',')

    log = structlog.get_logger()

    log.warning("CORS ORIGIN" + str(allowed_origins_config))
    if env == Environment.development:
        fastapi_app.dependency_overrides = {
            get_config: get_local_config,
#            authenticate: authenticate_mock
        }
        fastapi_app.add_middleware(
            CORSMiddleware,
            allow_origins=allowed_origins_config,
            allow_methods=["GET","POST","OPTIONS","HEAD","PATCH","DELETE", "PUT"],
            allow_headers=["*"],
            expose_headers=["*"],
            max_age=24 * 60 * 60,  # seconds
        )
    else:
        fastapi_app.add_middleware(
            CORSMiddleware,
            allow_origins=allowed_origins_config,
            allow_methods=["GET","POST","OPTIONS","HEAD", "PATCH","DELETE"],
            allow_headers=["*"],
            expose_headers=["*"],
            max_age=24 * 60 * 60,  # seconds
        )
    return fastapi_app

