# RTSP Livestream with Overlays

# 🚀 Live Demo 
 **View Webpage on** https://reaishma.github.io/RTSP-livestream/

## Overview 
This is a full-stack RTSP livestream application that enables users to stream RTSP video feeds with custom overlay functionality. The application allows users to responses
responses streams, add text and logo overlays, and manage overlay positioning with drag-and-drop functionality. It's designed for scenarios like IP camera monitoring, live streaming with branding, or video surveillance with information overlays.

![RTSP LIVESTREAM](https://github.com/Reaishma/RTSP-livestream/blob/main/Screenshot_20250904-122548_1.jpg)

## 🚀 Features

- **RTSP Stream Integration**: Configure and manage RTSP video streams
- **Custom Overlays**: Add text and logo overlays on top of video streams  
- **Drag & Drop Interface**: Position and resize overlays with mouse interaction
- **Real-time Management**: Live overlay updates and positioning
- **CRUD Operations**: Full create, read, update, delete for overlay configurations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **REST API**: Well-documented RESTful API endpoints
- **Database Persistence**: PostgreSQL storage for streams and overlay settings

## 🛠 Tech Stack

### Backend
- **Python Flask** - Web framework
- **PostgreSQL** - Database with SQLAlchemy ORM
- **Flask-CORS** - Cross-origin request support
- **RESTful APIs** - Standard HTTP methods and JSON responses
- **Routing Structure**: Separate blueprints for overlay and stream management
- **Video Processing**: FFmpeg integration for RTSP to HLS conversion (production-ready streaming)
## Data Models
- **Overlay Model**: Comprehensive overlay configuration with positioning, styling, and content properties
- **StreamSettings Model**: RTSP stream configuration and metadata storage
- **Database Schema**: PostgreSQL with SQLAlchemy migrations for schema management

## Video Streaming Architecture
- **RTSP Handling**: Custom RTSPHandler class for stream validation and conversion
- **Stream Conversion**: FFmpeg-based RTSP to HLS conversion for web browser compatibility
- **Real-time Updates**: Live overlay rendering on top of video streams
- **Validation Layer**: RTSP URL validation before stream initialization

## API Structure
- **Standardized Responses**: Consistent JSON response format with success/error states
- **Error Handling**: SQLAlchemy exception handling with appropriate HTTP status codes
- **CRUD Operations**: Full create, read, update, delete operations for overlays and streams
- **Input Validation**: Server-side validation for RTSP URLs and overlay configurations


### Frontend  
- **React 17** - Component-development implemented  UI (via CDN)
- **Bootstrap 5** - Responsivframeworkework
- **Feather Icons** - Consistent iconography
- **Axios** - HTTP client for API communication
- **Video.js** - Video play with HLS support
- **FFmpeg**: Command-line video processing for RTSP to HLS conversion
- **FFprobe**: Video stream analysis and validation tool

### Development
- **Flask Development Server** - Hot reload for development
- **SQLAlchemy** - Database ORM and migrations
- **Feather Icons**: Icon library for consistent UI elements
- **Babel Standalone** - JSX transformation in browser

## Third-party Integrations
- **RTSP Sources**: Integration with IP cameras, streaming servers, and video encoders
- **CDN Resources**: External CDN dependencies for React, Bootstrap, and other frontend libraries
- **Stream Validation**: External RTSP stream accessibility checking via FFprobe

## 📋 Prerequisites

Before running the application, ensure you have:

- **Python 3.8+** installed
- **PostgreSQL database** available
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **RTSP stream source** for testing (you can use RTSP.me)

## 🚀 Quick Start

### 1. Environment Setup

The application uses these environment variables (automatically configured in Replit):

```bash
DATABASE_URL=postgresql://username:password@host:port/database
FLASK_SECRET_KEY=your-secret-key-here
PGHOST=your-postgres-host
PGPORT=5432
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=your-database
```

### 2. Installation & Running

```bash
# Install dependencies
pip install flask flask-sqlalchemy flask-cors psycopg2-binary

# Run the application
python main.py
```

The application will be available at `http://localhost:5000`

### 3. Database Setup

The database tables are created automatically when the application starts. The schema includes:

- **overlays** - Stores overlay configurations (text/logo, positioning, styling)
- **stream_settings** - Stores RTSP stream configurations

## 📖 Usage Guide

### Setting Up RTSP Streams

1. **Navigate to Stream Configuration** (top-left section)
2. **Enter RTSP URL**: Must start with `rtsp://`
   - Example: `rtsp://demo.example.com/stream`
   - For testing: Use RTSP.me to create temporary streams
3. **Provide Stream Name**: Descriptive name for identification
4. **Click "Set Stream"** to save configuration

### Managing Overlays

#### Creating Overlays

1. **Click "Add Overlay"** in the Overlays panel (right side)
2. **Configure overlay properties**:
   - **Name**: Descriptive overlay name
   - **Type**: Choose "Text" or "Logo"
   - **Content**: 
     - Text overlays: Enter display text
     - Logo overlays: Enter image URL
   - **Appearance** (text only):
     - Font size: 8-72 pixels
     - Font color: Color picker
     - Opacity: 0-100% transparency

#### Positioning & Resizing

- **Move overlays**: Click and drag anywhere on the overlay
- **Resize overlays**: Hover to show resize handle, then drag
- **Real-time updates**: All changes save automatically

#### Managing Existing Overlays

Each overlay has control buttons:
- **Edit** (pencil): Modify overlay properties
- **Show/Hide** (eye): Toggle visibility
- **Delete** (trash): Remove permanently

### Video Controls

- **Play/Pause**: Control video playback
- **Volume**: Adjust audio level (0-100%)
- **Stream Info**: Current stream name and URL display

## 🔌 API Documentation

### Base URL
All API endpoints are prefixed with `/api/`

### Response Format
```json
{
  "success": true|false,
  "data": {},
  "message": "Optional message",
  "error": "Error message if success is false"
}
```

### Overlay Endpoints

#### GET /api/overlays
Get all overlays
```bash
curl http://localhost:5000/api/overlays
```

#### POST /api/overlays
Create new overlay
```bash
curl -X POST http://localhost:5000/api/overlays \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Text",
    "type": "text",
    "content": "Hello World",
    "font_size": 24,
    "font_color": "#FFFFFF",
    "opacity": 1.0
  }'
```

#### PUT /api/overlays/{id}
Update overlay
```bash
curl -X PUT http://localhost:5000/api/overlays/1 \
  -H "Content-Type: application/json" \
  -d '{
    "x_position": 100,
    "y_position": 50
  }'
```

#### DELETE /api/overlays/{id}
Delete overlay
```bash
curl -X DELETE http://localhost:5000/api/overlays/1
```

### Stream Endpoints

#### GET /api/streams
Get all stream configurations

#### POST /api/streams
Create new stream configuration
```bash
curl -X POST http://localhost:5000/api/streams \
  -H "Content-Type: application/json" \
  -d '{
    "rtsp_url": "rtsp://example.com/stream",
    "stream_name": "Main Camera",
    "is_active": true
  }'
```

#### POST /api/streams/validate
Validate RTSP URL format
```bash
curl -X POST http://localhost:5000/api/streams/validate \
  -H "Content-Type: application/json" \
  -d '{"rtsp_url": "rtsp://example.com/stream"}'
```

## 📁 Project Structure

```
rtsp-livestream/
├── main.py                 # Flask application entry point
├── database.py             # Database configuration
├── models.py               # SQLAlchemy data models
├── api/
│   ├── overlay_routes.py   # Overlay CRUD endpoints
│   └── stream_routes.py    # Stream management endpoints
├── static/
│   ├── app.js              # React frontend application
│   ├── styles.css          # Custom CSS styles
│   └── index.html          # Enhanced HTML template
├── templates/
│   └── index.html          # Flask template
├── utils/
│   └── rtsp_handler.py     # RTSP stream utilities (FFmpeg)
├── README.md               # This file
├── API_DOCUMENTATION.md    # Detailed API documentation
└── USER_DOCUMENTATION.md   # User guide
```

## ⚡ Performance Considerations

### Browser Limitations
**Important**: Direct RTSP playback in web browsers is not natively supported. The current implementation shows stream configuration and overlay functionality. For production deployment:

- **Server-side conversion**: Implement RTSP-to-HLS conversion using FFmpeg
- **WebRTC streaming**: For real-time low-latency streaming
- **Dedicated streaming servers**: Consider Wowza, Node Media Server, or similar

### Optimization Tips
- **Limit overlays**: Too many overlays can impact performance
- **Optimize images**: Use compressed images for logo overlays
- **Database indexing**: Consider indexes for frequently queried fields
- **Caching**: Implement caching for static overlay configurations

## 🧪 Testing

### Manual Testing
1. **Interface Loading**: Verify all UI components load properly
2. **Stream Configuration**: Test RTSP URL validation and storage
3. **Overlay Creation**: Create text and logo overlays
4. **Drag & Drop**: Test positioning and resizing functionality
5. **CRUD Operations**: Test create, update, delete for overlays

### Sample RTSP URLs for Testing
- **Big Buck Bunny**: `rtsp://wowzaec2demo.streamlock.net/vod-multitrack/_definst_/mp4:BigBuckBunny_115k.mov`
- **RTSP.me**: Create temporary streams at https://rtsp.me

## 🔧 Development

### Local Development Setup
1. Clone or fork the repository
2. Install Python dependencies: `pip install -r requirements.txt`
3. Set up PostgreSQL database
4. Configure environment variables
5. Run: `python main.py`

### Adding Features
- **Backend**: Add new endpoints in `api/` directory
- **Frontend**: Extend React components in `static/app.js`
- **Database**: Add models in `models.py`
- **Styling**: Modify `static/styles.css`

### Code Structure Guidelines
- **Flask Blueprints**: Organize API routes by functionality
- **React Components**: Use functional components with hooks
- **Database Models**: Follow SQLAlchemy best practices
- **Error Handling**: Implement comprehensive error responses

## 🐛 Troubleshooting

### Common Issues

**"No Stream Configured" Message**
- Ensure you've entered a valid RTSP URL in the stream configuration

**"Invalid RTSP URL Format" Error**
- URL must start with `rtsp://`
- Verify the format: `rtsp://server.com/stream`

**Overlays Not Appearing**
- Check overlay is active (eye icon shows open eye)
- Verify overlay is positioned within video bounds

**Database Connection Errors**
- Verify PostgreSQL is running
- Check `DATABASE_URL` environment variable
- Ensure database exists and is accessible

**API 500 Errors**
- Check Flask console logs for detailed error messages
- Verify database schema is created
- Check for import/dependency issues

### Debug Mode
The application runs in debug mode by default, providing:
- **Auto-reload**: Changes trigger automatic restart
- **Error details**: Detailed error pages and stack traces
- **Console logging**: Request/response logging

## 🔒 Security Considerations

- **Input validation**: All API endpoints validate input data
- **SQL injection protection**: SQLAlchemy ORM prevents SQL injection
- **CORS configuration**: Properly configured cross-origin requests
- **Environment variables**: Sensitive data stored in environment variables

### Production Deployment
For production deployment:
- Set `debug=False` in Flask configuration
- Use a production WSGI server (Gunicorn, uWSGI)
- Implement proper authentication and authorization
- Use HTTPS for secure communication
- Set up proper logging and monitoring

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, questions, or feature requests:
- Check the troubleshooting section above
- Review the API and User documentation
- Open an issue in the repository

## 🎯 Future Enhancements

Potential improvements and features:

- **User authentication**: Multi-user support with login system
- **Advanced overlays**: Animation, timers, and dynamic content
- **Stream recording**: Save and replay stream segments
- **Mobile app**: Native mobile application
- **Analytics**: Stream viewership and overlay engagement metrics

---

Built with ❤️ using React, Flask, and PostgreSQL
