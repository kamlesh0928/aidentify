import cv2
import numpy as np
from skimage import color
from skimage.measure import shannon_entropy

from app.utils.logger import logger

def extract_image_features(image_path: str) -> dict:
    """
        Extracts various features from an image located at image_path.
    """

    image = cv2.imread(image_path)

    if (image is None):
        logger.error(f"Image not found or unable to read at {image_path}")
        raise ValueError("Image not found or unable to read.")

    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Edge density using Canny edge detector
    edges = cv2.Canny(gray_image, 100, 200)
    edge_density = np.mean(edges > 0)

    # Noise level estimation using variance of Laplacian
    noise_level = cv2.Laplacian(gray_image, cv2.CV_64F).var()

    # Color entropy
    hsv = color.rgb2hsv(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    hue_entropy = shannon_entropy(hsv[:, :, 0])

    features = {
        "edge_density": edge_density,
        "noise_level": noise_level,
        "color_entropy": hue_entropy
    }

    logger.info(f"Extracted features from image {image_path}: {features}")

    return features
