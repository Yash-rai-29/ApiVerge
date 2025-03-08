import structlog
from structlog import BoundLogger

from environment import Environment


def get_logger() -> BoundLogger:
    """
    Returns an instance of structlog.BoundLogger. This function exists to serve as a dependency for
    FastAPI handlers.
    e.g.
    >>> log = get_logger()
    >>> log.info("something interesting happened", key1=1, key2=2)
s
    """
    return structlog.get_logger()


def configure_logging(environment: Environment):
    """
    Sets up the structlog processor pipeline
    """
    common_processors = [
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.format_exc_info,
    ]
    if environment == environment.development:
        structlog.configure(
            processors=common_processors
                       + [
                           structlog.dev.set_exc_info,
                           structlog.dev.ConsoleRenderer(),
                       ]
        )
    else:
        structlog.configure(
            processors=common_processors
                       + [
                           structlog.processors.JSONRenderer(),
                       ]
        )
