from database import db
from datetime import datetime
from sqlalchemy import Integer, String, Float, Text, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column

class Overlay(db.Model):
    """Model for storing overlay configurations"""
    __tablename__ = 'overlays'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)  # 'text' or 'logo'
    content: Mapped[str] = mapped_column(Text, nullable=True)  # Text content or image URL
    x_position: Mapped[float] = mapped_column(Float, default=0.0)
    y_position: Mapped[float] = mapped_column(Float, default=0.0)
    width: Mapped[float] = mapped_column(Float, default=100.0)
    height: Mapped[float] = mapped_column(Float, default=50.0)
    font_size: Mapped[int] = mapped_column(Integer, default=16, nullable=True)
    font_color: Mapped[str] = mapped_column(String(7), default='#FFFFFF', nullable=True)
    background_color: Mapped[str] = mapped_column(String(7), default='transparent', nullable=True)
    opacity: Mapped[float] = mapped_column(Float, default=1.0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert overlay to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'content': self.content,
            'x_position': self.x_position,
            'y_position': self.y_position,
            'width': self.width,
            'height': self.height,
            'font_size': self.font_size,
            'font_color': self.font_color,
            'background_color': self.background_color,
            'opacity': self.opacity,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class StreamSettings(db.Model):
    """Model for storing stream settings"""
    __tablename__ = 'stream_settings'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    rtsp_url: Mapped[str] = mapped_column(String(500), nullable=False)
    stream_name: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert stream settings to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'rtsp_url': self.rtsp_url,
            'stream_name': self.stream_name,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
