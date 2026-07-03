import cv2
import numpy as np

def extract_colors_from_image(image_bytes):
    """
    Takes raw image bytes, runs basic OpenCV processing to find the Rubik's cube grid,
    and returns a list of 9 colors representing the face.
    """
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Invalid image data")

    # For the scope of this project, we implement a simplified color extraction
    # assuming the user centers the cube face in the camera.
    # We will sample 9 points from the center of the image in a grid.
    
    height, width, _ = img.shape
    
    # Calculate a central bounding box
    box_size = min(height, width) // 2
    start_x = (width - box_size) // 2
    start_y = (height - box_size) // 2
    
    cell_size = box_size // 3
    
    colors_detected = []
    
    for row in range(3):
        for col in range(3):
            # Calculate the center of each cell
            cx = start_x + (col * cell_size) + (cell_size // 2)
            cy = start_y + (row * cell_size) + (cell_size // 2)
            
            # Sample a small 5x5 region around the center to get an average color
            region = img[cy-2:cy+3, cx-2:cx+3]
            avg_color_bgr = np.mean(region, axis=(0, 1))
            
            # Determine color category
            color = classify_color(avg_color_bgr)
            colors_detected.append(color)
            
    return colors_detected

def classify_color(bgr):
    """
    Classify a BGR color into one of the 6 Rubik's cube colors.
    Returns the standard facelet letter (U, R, F, D, L, B).
    """
    b, g, r = bgr
    # Simple heuristic classification based on dominant color channels
    if r > 150 and g > 150 and b > 150: return 'U' # White (Up)
    if r > 150 and g > 150 and b < 100: return 'D' # Yellow (Down)
    if r > 150 and g < 100 and b < 100: return 'R' # Red (Right)
    if r > 150 and g > 100 and b < 50: return 'F'  # Orange (Front)
    if g > 150 and r < 100 and b < 100: return 'L' # Green (Left)
    if b > 150 and r < 100 and g < 150: return 'B' # Blue (Back)
    
    # Fallback to white if unclear
    return 'U'
