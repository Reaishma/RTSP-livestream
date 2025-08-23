from flask import Blueprint, request, jsonify
from database import db
from models import StreamSettings
from sqlalchemy.exc import SQLAlchemyError
import re

stream_bp = Blueprint('stream', __name__)

def validate_rtsp_url(url):
    """Validate RTSP URL format"""
    rtsp_pattern = r'^rtsp://[^\s]+$'
    return re.match(rtsp_pattern, url) is not None

@stream_bp.route('/streams', methods=['GET'])
def get_streams():
    """Get all stream settings"""
    try:
        streams = StreamSettings.query.all()
        return jsonify({
            'success': True,
            'data': [stream.to_dict() for stream in streams]
        }), 200
    except SQLAlchemyError as e:
        return jsonify({
            'success': False,
            'error': f'Database error: {str(e)}'
        }), 500

@stream_bp.route('/streams/<int:stream_id>', methods=['GET'])
def get_stream(stream_id):
    """Get a specific stream by ID"""
    try:
        stream = StreamSettings.query.get(stream_id)
        if not stream:
            return jsonify({
                'success': False,
                'error': 'Stream not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': stream.to_dict()
        }), 200
    except SQLAlchemyError as e:
        return jsonify({
            'success': False,
            'error': f'Database error: {str(e)}'
        }), 500

@stream_bp.route('/streams', methods=['POST'])
def create_stream():
    """Create a new stream setting"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['rtsp_url', 'stream_name']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Validate RTSP URL format
        if not validate_rtsp_url(data['rtsp_url']):
            return jsonify({
                'success': False,
                'error': 'Invalid RTSP URL format. URL must start with rtsp://'
            }), 400
        
        # Create new stream setting
        stream = StreamSettings(
            rtsp_url=data['rtsp_url'],
            stream_name=data['stream_name'],
            is_active=data.get('is_active', True)
        )
        
        db.session.add(stream)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': stream.to_dict(),
            'message': 'Stream setting created successfully'
        }), 201
        
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Database error: {str(e)}'
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Unexpected error: {str(e)}'
        }), 500

@stream_bp.route('/streams/<int:stream_id>', methods=['PUT'])
def update_stream(stream_id):
    """Update an existing stream setting"""
    try:
        stream = StreamSettings.query.get(stream_id)
        if not stream:
            return jsonify({
                'success': False,
                'error': 'Stream not found'
            }), 404
        
        data = request.get_json()
        
        # Validate RTSP URL if provided
        if 'rtsp_url' in data and not validate_rtsp_url(data['rtsp_url']):
            return jsonify({
                'success': False,
                'error': 'Invalid RTSP URL format. URL must start with rtsp://'
            }), 400
        
        # Update stream fields
        for field in ['rtsp_url', 'stream_name', 'is_active']:
            if field in data:
                setattr(stream, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': stream.to_dict(),
            'message': 'Stream setting updated successfully'
        }), 200
        
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Database error: {str(e)}'
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Unexpected error: {str(e)}'
        }), 500

@stream_bp.route('/streams/<int:stream_id>', methods=['DELETE'])
def delete_stream(stream_id):
    """Delete a stream setting"""
    try:
        stream = StreamSettings.query.get(stream_id)
        if not stream:
            return jsonify({
                'success': False,
                'error': 'Stream not found'
            }), 404
        
        db.session.delete(stream)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Stream setting deleted successfully'
        }), 200
        
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Database error: {str(e)}'
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Unexpected error: {str(e)}'
        }), 500

@stream_bp.route('/streams/validate', methods=['POST'])
def validate_stream():
    """Validate an RTSP URL"""
    try:
        data = request.get_json()
        
        if 'rtsp_url' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing rtsp_url field'
            }), 400
        
        is_valid = validate_rtsp_url(data['rtsp_url'])
        
        return jsonify({
            'success': True,
            'is_valid': is_valid,
            'message': 'RTSP URL is valid' if is_valid else 'RTSP URL format is invalid'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Unexpected error: {str(e)}'
        }), 500
