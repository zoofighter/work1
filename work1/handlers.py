import os
import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado
from tornado.web import StaticFileHandler

class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        print("get_get")
        self.finish(json.dumps({
            "data": "This is /work1/get_example endpoint!"
        }))

    @tornado.web.authenticated
    def post(self):
        print("post_post")
        # input_data is a dictionary with a key "name"
        input_data = self.get_json_body()
        data = {"greetings": "Hello {}, enjoy JupyterLab!".format(input_data["name"])}
        self.finish(json.dumps(data))


def setup_handlers(web_app, url_path):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    print("base_url")
    print(base_url)
    # Prepend the base_url so that it works in a JupyterHub setting
    route_pattern = url_path_join(base_url, url_path, "hello")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
    print("route_pattern")
    print(route_pattern)

    # Prepend the base_url so that it works in a JupyterHub setting
    doc_url = url_path_join(base_url, url_path, "public")
    doc_dir = os.getenv(
        "test",
        os.path.join(os.path.dirname(__file__), "public"),
    )
    print(doc_dir)
    handlers = [("{}/(.*)".format(doc_url), StaticFileHandler, {"path": doc_dir})]
    web_app.add_handlers(".*$", handlers)
    print(web_app)




# def setup_handlers(web_app):
#     host_pattern = ".*$"

#     base_url = web_app.settings["base_url"]
#     route_pattern = url_path_join(base_url, "work1", "get_example")
#     handlers = [(route_pattern, RouteHandler)]
#     web_app.add_handlers(host_pattern, handlers)
