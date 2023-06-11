import logging
from django.conf import settings
import inspect
import traceback

def log_error (fmt, *params):
    name, func, line = get_upper_caller(1)
    msg = fmt.format(*params)
    logger = logging.getLogger('app_err')
    logger.error("[{0}:{1}:{2}] {3}".format(name, func, line, msg))
    logger.error(traceback.format_exc())

def get_upper_caller(lv):
    stack = inspect.stack()        
    caller = stack[lv + 1]
    line, func = caller[2:4]
    module = inspect.getmodule(caller[0])
    name = module.__name__ if module else ""

    return name, func, line   
