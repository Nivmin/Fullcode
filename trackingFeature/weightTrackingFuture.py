from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime

app = Flask(__name__)
CORS(app) 

DATA_FILE = 'weight_data.json'

def init_data_file():
    try:
        with open(DATA_FILE, 'r') as file:
            json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        with open(DATA_FILE, 'w') as file:
            json.dump([], file)

def read_data():
    with open(DATA_FILE, 'r') as file:
        return json.load(file)

def write_data(data):
    with open(DATA_FILE, 'w') as file:
        json.dump(data, file)

@app.route('/add_weight', methods=['POST'])
def add_weight():
    data = request.json
    user_id = data.get('user_id')
    weight = data.get('weight')
    date = data.get('date', datetime.now().strftime('%Y-%m-%d'))

    weight_entry = {
        'id': datetime.now().timestamp(),  
        'user_id': user_id,
        'date': date,
        'weight': weight
    }

    weights = read_data()
    weights.append(weight_entry)
    write_data(weights)

    return jsonify({'message': 'Weight entry added successfully'}), 201

@app.route('/remove_weight/<float:entry_id>', methods=['DELETE'])
def remove_weight(entry_id):
    weights = read_data()
    weights = [entry for entry in weights if entry['id'] != entry_id]
    write_data(weights)

    return jsonify({'message': 'Weight entry removed successfully'}), 200

@app.route('/get_weights', methods=['GET'])
def get_weights():
    weights = read_data()
    return jsonify(weights), 200

@app.route('/chart_data', methods=['GET'])
def chart_data():
    weights = read_data()
    weights.sort(key=lambda x: x['date'])  
    chart_data = {
        'dates': [entry['date'] for entry in weights],
        'weights': [entry['weight'] for entry in weights]
    }
    return jsonify(chart_data), 200

if __name__ == '__main__':
    init_data_file()
    app.run(host='0.0.0.0', port=9000, debug=True)

