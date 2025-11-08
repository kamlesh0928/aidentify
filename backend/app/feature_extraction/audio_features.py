import librosa
import numpy as np

from app.utils.logger import logger

def extract_audio_features(audio_path: str) -> dict:
    """
        Extracts basic audio features from the given audio file.
    """

    try:
        # Load the audio file (mono ensures single channel)
        y, sr = librosa.load(audio_path, sr=None, mono=True)

        # Extract features
        spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))
        spectral_bandwidth = np.mean(librosa.feature.spectral_bandwidth(y=y, sr=sr))
        zero_crossing_rate = np.mean(librosa.feature.zero_crossing_rate(y))
        rms = np.mean(librosa.feature.rms(y=y))
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfccs_mean = np.mean(mfccs, axis=1).tolist()   # Mean of each MFCC coefficient

        features = {
            "spectral_centroid": float(spectral_centroid),
            "spectral_bandwidth": float(spectral_bandwidth),
            "zero_crossing_rate": float(zero_crossing_rate),
            "rms_energy": float(rms),
            "mfccs_mean": mfccs_mean
        }

        logger.info(f"Extracted features from audio {audio_path}: {features}")
        return features
    
    except Exception as e:
        logger.error(f"Error extracting features from audio {audio_path}: {e}")
        raise ValueError(f"Error extracting features from audio {audio_path}: {e}")
