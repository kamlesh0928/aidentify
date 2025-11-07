import cv2
import numpy as np
from skimage import color
from skimage.measure import shannon_entropy

from app.utils.logger import logger

def extract_video_features(video_path: str) -> dict:
    """
        Extracts various features from video located at video_path.
    """

    # Load the video file using OpenCV
    video = cv2.VideoCapture(video_path)

    # Validate that the video is accessible
    if not video.isOpened():
        logger.error(f"Video not found or unable to read at {video_path}")
        raise ValueError("Video not found or unable to read.")
    
    # Total number of frames in video
    frame_count = int(video.get(cv2.CAP_PROP_FRAME_COUNT))

    # Select upto 30 frames for efficient feature sampling
    frame_indices = np.linspace(0, frame_count - 1, num=min(frame_count, 30), dtype=int)
    
    # Initialize lists to store feature values for each sampled frame
    edge_densities = []
    noise_levels = []
    color_entropies = []

    # Iterate through the sampled frame indices
    for idx in frame_indices:
        video.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = video.read()

        # Skip if frame could not be read
        if not ret:
            continue

        # Convert frame to grayscale for structural (edge/noise) analysis
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect edge density using Canny edge detector
        edges = cv2.Canny(gray_frame, 100, 200)
        edge_density = np.mean(edges > 0)

        # Noise level estimation using variance of Laplaciam
        noise_level = cv2.Laplacian(gray_frame, cv2.CV_64F).var()

        # Convert frame to HSV color space to focus on hue variation
        hsv = color.rgb2hsv(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        hue_entropy = shannon_entropy(hsv[:, :, 0])

        # Store all the frame feature values
        edge_densities.append(edge_density)
        noise_levels.append(noise_level)
        color_entropies.append(hue_entropy)
    
    # Release the video capture resource
    video.release()

    # Ensure that valid frames were processed
    if not edge_densities:
        logger.error(f"No valid frames read from {video_path}")
        raise ValueError("Unable to extract frames or compute features.")

    # Compute mean feature values across all sampled frames
    features = {
        "mean_edge_densities": float(np.mean(edge_densities)),
        "mean_noise_levels": float(np.mean(noise_levels)),
        "mean_color_entropies": float(np.mean(color_entropies))
    }

    logger.info(f"Extracted features from video {video_path}: {features}")
    return features
