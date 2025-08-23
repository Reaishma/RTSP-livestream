import os
from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
from database import db

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    CORS(app)

    # Setup a secret key, required by sessions
    app.secret_key = os.environ.get("FLASK_SECRET_KEY", "rtsp-livestream-secret-key")

    # Configure the database
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "postgresql://localhost/rtsp_app")
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_recycle": 300,
        "pool_pre_ping": True,
    }

    # Initialize the app with the extension
    db.init_app(app)

    @app.route('/')
    def index():
        """Serve the main landing page"""
        return render_template('index.html')

    @app.route('/static/<path:filename>')
    def serve_static(filename):
        """Serve static files"""
        return send_from_directory('static', filename)

    with app.app_context():
        # Import models to ensure tables are created
        from models import Overlay, StreamSettings
        db.create_all()

        # Import and register blueprints after app context is created
        from api.overlay_routes import overlay_bp
        from api.stream_routes import stream_bp
        
        # Register blueprints
        app.register_blueprint(overlay_bp, url_prefix='/api')
        app.register_blueprint(stream_bp, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
