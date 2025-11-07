import mimetypes

# If python-magic is available, use it for better MIME type detection
try:
    import magic
except ImportError:
    magic = None

def detect_mime_type(file_path: str) -> str:
    """
        Detects the MIME type of any file (image, video, etc)
        based on its content and file extension.
    """

    mime_type = None

    # Try to detect MIME type using python-magic if available
    if magic:
        try:
            mime_type = magic.Magic(mime=True).from_file(file_path)
        
        except Exception:
            pass
    
    # Fallback to mimetypes based on file extension
    if not mime_type:
        mime_type, _ = mimetypes.guess_type(file_path)

    return mime_type or "application/octet-stream"