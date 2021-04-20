from flask import Flask, request
from flask_cors import  CORS, cross_origin
from client import start
from asyncio import run
app = Flask(__name__)

CORS(app)   

@app.route('/', methods=['POST'])
def root():
    result = run(start(request.json))
    return f"Only POST.{result}"

if __name__ == '__main__':
    app.run()

