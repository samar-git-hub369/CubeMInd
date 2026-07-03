from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Ensure the solver module is in the path. We'll build it in backend/solver/build/
sys.path.append(os.path.join(os.path.dirname(__file__), 'solver', 'build'))

try:
    import cubemind_solver
except ImportError:
    print("Warning: cubemind_solver not found. Make sure to build the C++ module.")
    cubemind_solver = None

from vision import extract_colors_from_image

app = Flask(__name__)
CORS(app) # Allow frontend to call the API

@app.route('/api/solve', methods=['POST'])
def solve_cube():
    data = request.get_json()
    if not data or 'state' not in data:
        return jsonify({"error": "Missing cube state"}), 400
        
    state = data['state']
    if len(state) != 54:
        return jsonify({"error": "State must be 54 characters"}), 400
        
    if not cubemind_solver:
        return jsonify({"error": "Solver module not loaded"}), 500

    try:
        # Calls our high-performance C++ solver
        solution_moves = cubemind_solver.solve(state)
        return jsonify({
            "status": "success",
            "solution": solution_moves
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/scan', methods=['POST'])
def scan_face():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
        
    file = request.files['image']
    image_bytes = file.read()
    
    try:
        colors = extract_colors_from_image(image_bytes)
        return jsonify({
            "status": "success",
            "colors": colors
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
