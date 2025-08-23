from flask import Blueprint, request, jsonify
from database import db
from models import Overlay
from sqlalchemy.exc import SQLAlchemyError

overlay_bp = Blueprint('overlay', __name__)

@overlay_bp.route('/overlays', methods=['GET'])
def get_overlays():
    """Get all overlays"""
    try:
        overlays = Overlay.query.all()
        return jsonify({
            'success': True,
            'data': [overlay.to_dict() for overlay in overlays]
        }), 200
    except SQLAlchemyError as e:
        return jsonify({
            'success': False,
            'error': f'Database error: {str(e)}'
        }), 500

@overlay_bp.route('/overlays/<int:overlay_id>', methods=['GET'])
def get_overlay(overlay_id):
    """Get a specific overlay by ID"""
    try:
        overlay = Overlay.query.get(overlay_id)
        if not overlay:
            return jsonify({
                'success': False,
                'error': 'Overlay not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': overlay.to_dict()
        }), 200
    except SQLAlchemyError as e:
        return jsonify({
            'success': False,
            'error': f'Database error: {str(e)}'
        }), 500

@overlay_bp.route('/overlays', methods=['POST'])
def create_overlay():
    """Create a new overlay"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'type']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Validate overlay type
        if data['type'] not in ['text', 'logo']:
            return jsonify({
                'success': False,
                'error': 'Overlay type must be either "text" or "logo"'
            }), 400
        
        # Create new overlay
        overlay = Overlay(
            name=data['name'],
            type=data['type'],
            content=data.get('content', ''),
            x_position=data.get('x_position', 0.0),
            y_position=data.get('y_position', 0.0),
            width=data.get('width', 100.0),
            height=data.get('height', 50.0),
            font_size=data.get('font_size', 16),
            font_color=data.get('font_color', '#FFFFFF'),
            background_color=data.get('background_color', 'transparent'),
            opacity=data.get('opacity', 1.0),
            is_active=data.get('is_active', True)
        )
        
        db.session.add(overlay)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': overlay.to_dict(),
            'message': 'Overlay created successfully'
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

@overlay_bp.route('/overlays/<int:overlay_id>', methods=['PUT'])
def update_overlay(overlay_id):
    """Update an existing overlay"""
    try:
        overlay = Overlay.query.get(overlay_id)
        if not overlay:
            return jsonify({
                'success': False,
                'error': 'Overlay not found'
            }), 404
        
        data = request.get_json()
        
        # Update overlay fields
        for field in ['name', 'type', 'content', 'x_position', 'y_position', 
                     'width', 'height', 'font_size', 'font_color', 
                     'background_color', 'opacity', 'is_active']:
            if field in data:
                setattr(overlay, field, data[field])
        
        # Validate overlay type if updated
        if 'type' in data and data['type'] not in ['text', 'logo']:
            return jsonify({
                'success': False,
                'error': 'Overlay type must be either "text" or "logo"'
            }), 400
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': overlay.to_dict(),
            'message': 'Overlay updated successfully'
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

@overlay_bp.route('/overlays/<int:overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    """Delete an overlay"""
    try:
        overlay = Overlay.query.get(overlay_id)
        if not overlay:
            return jsonify({
                'success': False,
                'error': 'Overlay not found'
            }), 404
        
        db.session.delete(overlay)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Overlay deleted successfully'
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
