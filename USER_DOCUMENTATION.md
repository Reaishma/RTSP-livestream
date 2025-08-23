# User Documentation - RTSP Livestream with Overlays

This guide explains how to set up and use the RTSP Livestream application with custom overlay functionality.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Setting Up RTSP Streams](#setting-up-rtsp-streams)
3. [Managing Overlays](#managing-overlays)
4. [Video Controls](#video-controls)
5. [Troubleshooting](#troubleshooting)
6. [Best Practices](#best-practices)

## Getting Started

### Prerequisites

Before using the application, ensure you have:

- A running instance of the application (accessible at `http://localhost:5000`)
- Valid RTSP stream URLs for testing
- Modern web browser (Chrome, Firefox, Safari, Edge)

### First Time Setup

1. Open your web browser and navigate to the application URL
2. You'll see the main interface with two main sections:
   - **Stream Configuration** (left side)
   - **Overlay Management** (right side)

## Setting Up RTSP Streams

### What is RTSP?

RTSP (Real Time Streaming Protocol) is a network control protocol for streaming media servers. Common sources include:

- IP cameras
- Streaming servers
- Video encoders
- Live streaming platforms

### Adding an RTSP Stream

1. **Locate the Stream Configuration section** at the top left of the interface

2. **Enter your RTSP URL** in the "RTSP URL" field:
   - Must start with `rtsp://`
   - Example: `rtsp://demo.com/stream`
   - For testing, you can use services like RTSP.me

3. **Provide a Stream Name**:
   - Give your stream a descriptive name
   - Example: "Main Security Camera", "Conference Room"

4. **Click "Set Stream"** to save the configuration

### Testing RTSP URLs

For testing purposes, you can use these sample RTSP streams:

- **Big Buck Bunny (Sample)**: `rtsp://wowzaec2demo.streamlock.net/vod-multitrack/_definst_/mp4:BigBuckBunny_115k.mov`
- **RTSP.me**: Create temporary streams at https://rtsp.me

### RTSP Stream Requirements

- **Format**: URL must start with `rtsp://`
- **Accessibility**: Stream must be publicly accessible or on your local network
- **Codec**: H.264 video codec recommended for best compatibility
- **Network**: Ensure firewall allows RTSP traffic (typically port 554)

## Managing Overlays

Overlays are custom elements that appear on top of your video stream. You can add text labels, logos, timestamps, or other visual elements.

### Types of Overlays

1. **Text Overlays**: Display custom text with formatting options
2. **Logo Overlays**: Display images or logos using image URLs

### Creating an Overlay

1. **Click "Add Overlay"** in the Overlays panel (right side)

2. **Fill in the overlay details**:
   - **Name**: Give your overlay a descriptive name
   - **Type**: Choose "Text" or "Logo"
   - **Content**: 
     - For text: Enter the text to display
     - For logo: Enter the image URL

3. **Configure appearance** (for text overlays):
   - **Font Size**: Choose size from 8 to 72 pixels
   - **Font Color**: Click the color picker to select text color
   - **Opacity**: Use the slider to adjust transparency (0-100%)

4. **Click "Create"** to add the overlay to your stream

### Positioning Overlays

Once created, overlays can be positioned and resized:

#### Moving Overlays
- **Click and drag** any overlay to move it around the video area
- Overlays will snap to the video boundaries
- Real-time positioning updates are saved automatically

#### Resizing Overlays
- **Hover over an overlay** to see the resize handle (small blue circle)
- **Click and drag the resize handle** to adjust size
- Minimum size limits prevent overlays from becoming too small

### Managing Existing Overlays

Each overlay in the list has control buttons:

- **Edit** (pencil icon): Modify overlay properties
- **Show/Hide** (eye icon): Toggle overlay visibility
- **Delete** (trash icon): Permanently remove the overlay

### Overlay Properties

When editing an overlay, you can modify:

- **Name**: Change the display name
- **Content**: Update text or image URL
- **Font Size**: Adjust text size (text overlays only)
- **Font Color**: Change text color (text overlays only)
- **Opacity**: Adjust transparency level
- **Position**: Fine-tune X/Y coordinates
- **Size**: Adjust width and height

## Video Controls

### Basic Playback Controls

Located at the bottom of the video player:

- **Play/Pause Button**: Start or stop video playback
- **Volume Slider**: Adjust audio volume (0-100%)

### Stream Information

When a stream is configured, you'll see:
- Current stream name displayed above the configuration form
- RTSP URL shown in the video area
- Connection status indicators

### Browser Limitations

**Important Note**: Due to browser security restrictions, direct RTSP playback in web browsers is not natively supported. The current interface demonstrates the overlay functionality and stream configuration. For production use:

- Implement server-side RTSP-to-HLS conversion using FFmpeg
- Use WebRTC for real-time streaming
- Consider dedicated streaming servers (Wowza, Node Media Server)

## Troubleshooting

### Common Issues and Solutions

#### "No Stream Configured" Message
- **Cause**: No RTSP URL has been set
- **Solution**: Configure a valid RTSP stream in the Stream Configuration section

#### "Invalid RTSP URL Format" Error
- **Cause**: URL doesn't start with `rtsp://` or contains invalid characters
- **Solution**: Ensure URL format is correct: `rtsp://server.com/stream`

#### Overlays Not Appearing
- **Cause**: Overlay is inactive or positioned outside video area
- **Solution**: Check that overlay is active (eye icon) and positioned within video bounds

#### Cannot Move or Resize Overlays
- **Cause**: Browser compatibility or JavaScript errors
- **Solution**: 
  - Refresh the page
  - Check browser console for errors
  - Ensure JavaScript is enabled

#### Stream Connection Issues
- **Cause**: Network connectivity, firewall, or stream availability
- **Solution**:
  - Verify RTSP URL is accessible
  - Check network connectivity
  - Test with known working RTSP streams

### Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Missing required field" | Required form field is empty | Fill in all required fields |
| "Database error" | Server-side database issue | Contact administrator |
| "Overlay not found" | Trying to access non-existent overlay | Refresh page and try again |
| "Invalid URL format" | RTSP URL format is incorrect | Use proper rtsp:// format |

## Best Practices

### RTSP Stream Configuration

1. **Test URLs First**: Verify RTSP streams work with VLC or similar players before adding to the application

2. **Use Descriptive Names**: Give streams clear, descriptive names for easy identification

3. **Network Considerations**: Ensure streams are accessible from the server's network location

### Overlay Design

1. **Keep It Simple**: Use clear, readable text and appropriately sized logos

2. **Contrast**: Ensure text color contrasts well with video background

3. **Size Appropriately**: Make overlays large enough to read but not so large they obscure important video content

4. **Strategic Positioning**: Place overlays in corners or edges to avoid blocking main video content

### Performance Optimization

1. **Limit Overlay Count**: Too many overlays can impact performance

2. **Optimize Images**: Use compressed images for logo overlays

3. **Regular Cleanup**: Remove unused overlays to keep the interface clean

### Security Considerations

1. **Private Streams**: Be cautious when using private RTSP streams in shared environments

2. **Image URLs**: Verify logo image URLs are from trusted sources

3. **Access Control**: Implement proper access controls for production environments

## Getting Help

### Support Resources

- **Application Logs**: Check browser console for JavaScript errors
- **Network Tools**: Use browser developer tools to diagnose network issues
- **Testing Tools**: Use VLC or similar to test RTSP stream connectivity

### Common Use Cases

1. **Security Monitoring**: Add camera names and timestamps to security feeds
2. **Live Events**: Brand streams with logos and event information
3. **Educational Content**: Add instructional text to training videos
4. **Broadcasting**: Include channel branding and viewer information

For additional support or feature requests, consult the application documentation or contact the development team.
