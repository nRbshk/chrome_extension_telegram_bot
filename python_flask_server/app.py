from flask import Flask, request
from flask_cors import  CORS, cross_origin
from client import start
from asyncio import run
app = Flask(__name__)

CORS(app)   

@app.route('/', methods=['POST'])
def root():
    if request.method == 'POST':
        data = request.json
        params = dict.fromkeys(['cmd', 'name', 'status', 'episode', 'dub_or_sub', 'page'])
        params['cmd'] = data['cmd']
        params['name'] = data['name']
        params['status'] = data['status']
        params['episode'] = data['episode']
        params['dub_or_sub'] = data['dub_or_sub']
        params['page'] = data['page']
        
        result = run(start(params))
        return result
    return "Only POST."

if __name__ == '__main__':
    app.run()

