# API Documentation

This document describes the REST API endpoints for the RTSP Livestream with Overlays application.

## Base URL

All API endpoints are prefixed with `/api/`

Example: `http://localhost:5000/api/overlays`

## Response Format

All API responses follow this standard format:

```json
{
  "success": true|false,
  "data": {},
  "message": "Optional message",
  "error": "Error message if success is false"
}
