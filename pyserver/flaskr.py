from flask import Flask, send_from_directory
import os
import userData
import userLogin
import getData
import userRegistration
import songData
import songbookData
import downloadData
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper
from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop

print("Initialization")

app = Flask(__name__)

# A következő függvény miatt lehet POST requesttel hívni kívülről a szervert
basestring = (str,bytes)
def crossdomain(origin=None, methods=None, headers=None, max_age=21600, attach_to_all=True, automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator


@app.route("/userData/", methods=['GET','POST', 'OPTIONS'])
@crossdomain(origin='*')
def userD():
	return userData.run(request.values)

@app.route("/userLogin/", methods=['GET','POST', 'OPTIONS'])
@crossdomain(origin='*')
def userL():
    return userLogin.run(request.values)

@app.route("/userRegistration/", methods=['GET','POST', 'OPTIONS'])
@crossdomain(origin='*')
def userR():
    return userRegistration.run(request.values)

@app.route("/getData/", methods=['GET','POST', 'OPTIONS'])
@crossdomain(origin='*')
def getD():
    return getData.run(request.values)

@app.route("/songData/", methods=['GET','POST', 'OPTIONS'])
@crossdomain(origin='*')
def songD():
    return songData.run(request.values)

@app.route("/songbookData/", methods=['GET','POST', 'OPTIONS'])
@crossdomain(origin='*')
def songbD():
    return songbookData.run(request.values)

@app.route("/downloadData/", methods=['GET','POST', 'OPTIONS'])
@crossdomain(origin='*')
def downloadD():
    return downloadData.run(request.values)

@app.route("/kill/", methods=['GET','POST', 'OPTIONS'])
@crossdomain(origin='*')
def kill():
    IOLoop.instance().stop()
    print("Server killed at port: ",port)
    return "Killed"

port = 5000
http_server = None
if __name__ == "__main__":
    #app.debug = True
    #app.run(host="127.0.0.1", port=5000, threaded=True)
    http_server = HTTPServer(WSGIContainer(app))
    http_server.listen(port)
    print("Server started at port: ",port)
    IOLoop.instance().start()