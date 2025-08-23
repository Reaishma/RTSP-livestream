import subprocess
import threading
import time
import os
from typing import Optional

class RTSPHandler:
    """
    Handler for RTSP streams using FFmpeg
    Note: This is a basic implementation. In production, you'd want to use
    more robust streaming solutions like Wowza, Node Media Server, or GStreamer
    """
    
    def __init__(self):
        self.active_streams = {}
        self.ffmpeg_processes = {}
    
    def validate_rtsp_url(self, rtsp_url: str) -> bool:
        """
        Validate if RTSP URL is accessible
        """
        try:
            # Use ffprobe to check if stream is accessible
            cmd = [
                'ffprobe',
                '-v', 'quiet',
                '-print_format', 'json',
                '-show_streams',
                '-timeout', '10000000',  # 10 second timeout
                rtsp_url
            ]
            
            result = subprocess.run(cmd, capture_output=True, timeout=15)
            return result.returncode == 0
        except (subprocess.TimeoutExpired, FileNotFoundError):
            return False
    
    def start_hls_conversion(self, rtsp_url: str, output_dir: str, stream_id: str) -> bool:
        """
        Convert RTSP stream to HLS for web playback
        """
        try:
            # Ensure output directory exists
            os.makedirs(output_dir, exist_ok=True)
            
            output_path = os.path.join(output_dir, f"{stream_id}.m3u8")
            
            # FFmpeg command to convert RTSP to HLS
            cmd = [
                'ffmpeg',
                '-i', rtsp_url,
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-f', 'hls',
                '-hls_time', '2',
                '-hls_list_size', '3',
                '-hls_wrap', '3',
                '-hls_flags', 'delete_segments',
                '-y',  # Overwrite output
                output_path
            ]
            
            # Start FFmpeg process
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                universal_newlines=True
            )
            
            # Store process reference
            self.ffmpeg_processes[stream_id] = process
            self.active_streams[stream_id] = {
                'rtsp_url': rtsp_url,
                'hls_path': output_path,
                'started_at': time.time()
            }
            
            return True
            
        except Exception as e:
            print(f"Error starting HLS conversion: {e}")
            return False
    
    def stop_stream(self, stream_id: str) -> bool:
        """
        Stop streaming and cleanup
        """
        try:
            if stream_id in self.ffmpeg_processes:
                process = self.ffmpeg_processes[stream_id]
                process.terminate()
                process.wait(timeout=5)
                del self.ffmpeg_processes[stream_id]
            
            if stream_id in self.active_streams:
                del self.active_streams[stream_id]
            
            return True
            
        except Exception as e:
            print(f"Error stopping stream: {e}")
            return False
    
    def get_stream_info(self, stream_id: str) -> Optional[dict]:
        """
        Get information about an active stream
        """
        return self.active_streams.get(stream_id)
    
    def list_active_streams(self) -> dict:
        """
        List all active streams
        """
        return self.active_streams.copy()
    
    def cleanup_all(self):
        """
        Stop all active streams and cleanup
        """
        for stream_id in list(self.ffmpeg_processes.keys()):
            self.stop_stream(stream_id)

# Global RTSP handler instance
rtsp_handler = RTSPHandler()
