const { useState, useEffect, useRef } = React;

// API service for overlays
const overlayAPI = {
    getAll: () => axios.get('/api/overlays'),
    get: (id) => axios.get(`/api/overlays/${id}`),
    create: (data) => axios.post('/api/overlays', data),
    update: (id, data) => axios.put(`/api/overlays/${id}`, data),
    delete: (id) => axios.delete(`/api/overlays/${id}`)
};

// API service for streams
const streamAPI = {
    getAll: () => axios.get('/api/streams'),
    create: (data) => axios.post('/api/streams', data),
    validate: (url) => axios.post('/api/streams/validate', { rtsp_url: url })
};

// Video Player Component
const VideoPlayer = ({ rtspUrl, overlays, onOverlayUpdate }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1.0);

    useEffect(() => {
        if (videoRef.current && rtspUrl) {
            // Initialize video player (Note: RTSP requires server-side conversion to HLS/WebRTC)
            // For demo purposes, we'll use a placeholder that shows the RTSP URL
            const video = videoRef.current;
            
            // Set up basic video controls
            video.addEventListener('play', () => setIsPlaying(true));
            video.addEventListener('pause', () => setIsPlaying(false));
            video.addEventListener('volumechange', () => setVolume(video.volume));
        }
    }, [rtspUrl]);

    const togglePlay = () => {
        const video = videoRef.current;
        if (video) {
            if (isPlaying) {
                video.pause();
            } else {
                video.play();
            }
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    return (
        <div className="video-container position-relative">
            <div className="video-placeholder">
                {rtspUrl ? (
                    <div className="alert alert-info">
                        <h5>RTSP Stream Configuration</h5>
                        <p><strong>URL:</strong> {rtspUrl}</p>
                        <p className="small">Note: Direct RTSP playback in browsers requires server-side conversion to HLS or WebRTC. This is a demo interface showing the stream configuration and overlay functionality.</p>
                    </div>
                ) : (
                    <div className="alert alert-warning">
                        <h5>No Stream Configured</h5>
                        <p>Please enter an RTSP URL to configure the livestream.</p>
                    </div>
                )}
            </div>
            
            {/* Video Controls */}
            <div className="video-controls">
                <button 
                    className="btn btn-primary btn-sm me-2" 
                    onClick={togglePlay}
                    disabled={!rtspUrl}
                >
                    <i data-feather={isPlaying ? 'pause' : 'play'}></i>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                
                <div className="volume-control d-flex align-items-center">
                    <i data-feather="volume-2" className="me-2"></i>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="form-range"
                        style={{ width: '100px' }}
                    />
                </div>
            </div>

            {/* Overlay Container */}
            <div className="overlay-container">
                {overlays.filter(overlay => overlay.is_active).map(overlay => (
                    <OverlayElement
                        key={overlay.id}
                        overlay={overlay}
                        onUpdate={onOverlayUpdate}
                    />
                ))}
            </div>
        </div>
    );
};

// Draggable Overlay Element Component
const OverlayElement = ({ overlay, onUpdate }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const elementRef = useRef(null);

    const handleMouseDown = (e) => {
        if (e.target.classList.contains('resize-handle')) {
            setIsResizing(true);
        } else {
            setIsDragging(true);
        }
        setDragStart({
            x: e.clientX - overlay.x_position,
            y: e.clientY - overlay.y_position
        });
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;
            
            onUpdate(overlay.id, {
                x_position: Math.max(0, newX),
                y_position: Math.max(0, newY)
            });
        } else if (isResizing) {
            const rect = elementRef.current.getBoundingClientRect();
            const newWidth = e.clientX - rect.left;
            const newHeight = e.clientY - rect.top;
            
            onUpdate(overlay.id, {
                width: Math.max(50, newWidth),
                height: Math.max(30, newHeight)
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isResizing, overlay.x_position, overlay.y_position, dragStart]);

    const overlayStyle = {
        position: 'absolute',
        left: `${overlay.x_position}px`,
        top: `${overlay.y_position}px`,
        width: `${overlay.width}px`,
        height: `${overlay.height}px`,
        opacity: overlay.opacity,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 10,
        border: '1px dashed rgba(255, 255, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    if (overlay.type === 'text') {
        overlayStyle.fontSize = `${overlay.font_size}px`;
        overlayStyle.color = overlay.font_color;
        overlayStyle.backgroundColor = overlay.background_color === 'transparent' ? 'rgba(0,0,0,0.3)' : overlay.background_color;
        overlayStyle.padding = '5px';
        overlayStyle.borderRadius = '3px';
    }

    return (
        <div
            ref={elementRef}
            className="overlay-element"
            style={overlayStyle}
            onMouseDown={handleMouseDown}
        >
            {overlay.type === 'text' ? (
                <span>{overlay.content || 'Text Overlay'}</span>
            ) : (
                <img 
                    src={overlay.content || 'https://via.placeholder.com/100x50/333/fff?text=Logo'} 
                    alt="Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x50/333/fff?text=Logo';
                    }}
                />
            )}
            <div className="resize-handle"></div>
        </div>
    );
};

// Overlay Management Panel Component
const OverlayPanel = ({ overlays, onOverlayCreate, onOverlayUpdate, onOverlayDelete }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'text',
        content: '',
        font_size: 16,
        font_color: '#FFFFFF',
        background_color: 'transparent',
        opacity: 1.0
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await onOverlayUpdate(editingId, formData);
                setEditingId(null);
            } else {
                await onOverlayCreate(formData);
                setIsCreating(false);
            }
            setFormData({
                name: '',
                type: 'text',
                content: '',
                font_size: 16,
                font_color: '#FFFFFF',
                background_color: 'transparent',
                opacity: 1.0
            });
        } catch (error) {
            console.error('Error saving overlay:', error);
            alert('Error saving overlay. Please try again.');
        }
    };

    const startEditing = (overlay) => {
        setEditingId(overlay.id);
        setFormData({
            name: overlay.name,
            type: overlay.type,
            content: overlay.content,
            font_size: overlay.font_size,
            font_color: overlay.font_color,
            background_color: overlay.background_color,
            opacity: overlay.opacity
        });
        setIsCreating(true);
    };

    const cancelEditing = () => {
        setIsCreating(false);
        setEditingId(null);
        setFormData({
            name: '',
            type: 'text',
            content: '',
            font_size: 16,
            font_color: '#FFFFFF',
            background_color: 'transparent',
            opacity: 1.0
        });
    };

    return (
        <div className="overlay-panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Overlays</h5>
                <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsCreating(true)}
                >
                    <i data-feather="plus"></i> Add Overlay
                </button>
            </div>

            {/* Overlay List */}
            <div className="overlay-list mb-3">
                {overlays.length === 0 ? (
                    <div className="alert alert-info">
                        <p className="mb-0">No overlays created yet. Click "Add Overlay" to get started.</p>
                    </div>
                ) : (
                    overlays.map(overlay => (
                        <div key={overlay.id} className="overlay-item card mb-2">
                            <div className="card-body p-2">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{overlay.name}</strong>
                                        <small className="d-block text-muted">
                                            {overlay.type} - {overlay.is_active ? 'Active' : 'Inactive'}
                                        </small>
                                    </div>
                                    <div className="btn-group btn-group-sm">
                                        <button 
                                            className="btn btn-outline-primary"
                                            onClick={() => startEditing(overlay)}
                                        >
                                            <i data-feather="edit-2"></i>
                                        </button>
                                        <button 
                                            className="btn btn-outline-success"
                                            onClick={() => onOverlayUpdate(overlay.id, { is_active: !overlay.is_active })}
                                        >
                                            <i data-feather={overlay.is_active ? 'eye-off' : 'eye'}></i>
                                        </button>
                                        <button 
                                            className="btn btn-outline-danger"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this overlay?')) {
                                                    onOverlayDelete(overlay.id);
                                                }
                                            }}
                                        >
                                            <i data-feather="trash-2"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create/Edit Form */}
            {isCreating && (
                <div className="overlay-form card">
                    <div className="card-header">
                        <h6>{editingId ? 'Edit' : 'Create'} Overlay</h6>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label">Type</label>
                                <select
                                    className="form-select"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="text">Text</option>
                                    <option value="logo">Logo</option>
                                </select>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label">
                                    {formData.type === 'text' ? 'Text Content' : 'Image URL'}
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder={formData.type === 'text' ? 'Enter text...' : 'Enter image URL...'}
                                />
                            </div>
                            
                            {formData.type === 'text' && (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label">Font Size</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={formData.font_size}
                                            onChange={(e) => setFormData({ ...formData, font_size: parseInt(e.target.value) })}
                                            min="8"
                                            max="72"
                                        />
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label className="form-label">Font Color</label>
                                        <input
                                            type="color"
                                            className="form-control"
                                            value={formData.font_color}
                                            onChange={(e) => setFormData({ ...formData, font_color: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}
                            
                            <div className="mb-3">
                                <label className="form-label">Opacity</label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={formData.opacity}
                                    onChange={(e) => setFormData({ ...formData, opacity: parseFloat(e.target.value) })}
                                />
                                <small className="text-muted">{Math.round(formData.opacity * 100)}%</small>
                            </div>
                            
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary">
                                    {editingId ? 'Update' : 'Create'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={cancelEditing}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Main Application Component
const App = () => {
    const [rtspUrl, setRtspUrl] = useState('');
    const [overlays, setOverlays] = useState([]);
    const [currentStreamName, setCurrentStreamName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Load initial data
    useEffect(() => {
        loadOverlays();
        loadStreams();
    }, []);

    // Update Feather icons when component updates
    useEffect(() => {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    });

    const loadOverlays = async () => {
        try {
            const response = await overlayAPI.getAll();
            setOverlays(response.data.data);
        } catch (error) {
            console.error('Error loading overlays:', error);
            setError('Failed to load overlays');
        }
    };

    const loadStreams = async () => {
        try {
            const response = await streamAPI.getAll();
            const streams = response.data.data;
            if (streams.length > 0) {
                const activeStream = streams.find(s => s.is_active) || streams[0];
                setRtspUrl(activeStream.rtsp_url);
                setCurrentStreamName(activeStream.stream_name);
            }
        } catch (error) {
            console.error('Error loading streams:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRtspSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const url = form.rtsp_url.value;
        const name = form.stream_name.value;

        if (!url || !name) {
            alert('Please fill in both RTSP URL and Stream Name');
            return;
        }

        try {
            // Validate RTSP URL
            const validateResponse = await streamAPI.validate(url);
            if (!validateResponse.data.is_valid) {
                alert('Invalid RTSP URL format. Please ensure the URL starts with rtsp://');
                return;
            }

            // Create new stream setting
            await streamAPI.create({
                rtsp_url: url,
                stream_name: name,
                is_active: true
            });

            setRtspUrl(url);
            setCurrentStreamName(name);
            setError('');
            
            form.reset();
            alert('Stream configuration saved successfully!');
        } catch (error) {
            console.error('Error setting RTSP URL:', error);
            setError('Failed to set RTSP URL. Please check the URL and try again.');
        }
    };

    const handleOverlayCreate = async (overlayData) => {
        try {
            const response = await overlayAPI.create(overlayData);
            setOverlays([...overlays, response.data.data]);
        } catch (error) {
            console.error('Error creating overlay:', error);
            throw error;
        }
    };

    const handleOverlayUpdate = async (id, updateData) => {
        try {
            const response = await overlayAPI.update(id, updateData);
            setOverlays(overlays.map(overlay => 
                overlay.id === id ? response.data.data : overlay
            ));
        } catch (error) {
            console.error('Error updating overlay:', error);
            throw error;
        }
    };

    const handleOverlayDelete = async (id) => {
        try {
            await overlayAPI.delete(id);
            setOverlays(overlays.filter(overlay => overlay.id !== id));
        } catch (error) {
            console.error('Error deleting overlay:', error);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <header className="py-3 mb-4 border-bottom">
                        <h1 className="h3">RTSP Livestream with Overlays</h1>
                        <p className="text-muted">Configure RTSP streams and manage custom overlays</p>
                    </header>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger alert-dismissible" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}

            <div className="row">
                <div className="col-lg-8">
                    {/* RTSP Configuration */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5>Stream Configuration</h5>
                        </div>
                        <div className="card-body">
                            {currentStreamName && (
                                <div className="alert alert-info mb-3">
                                    <strong>Current Stream:</strong> {currentStreamName}
                                </div>
                            )}
                            
                            <form onSubmit={handleRtspSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="rtsp_url" className="form-label">RTSP URL</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="rtsp_url"
                                                name="rtsp_url"
                                                placeholder="rtsp://example.com/stream"
                                                required
                                            />
                                            <div className="form-text">
                                                Enter a valid RTSP stream URL. You can use services like RTSP.me for testing.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="stream_name" className="form-label">Stream Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="stream_name"
                                                name="stream_name"
                                                placeholder="My Stream"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="mb-3">
                                            <label className="form-label">&nbsp;</label>
                                            <button type="submit" className="btn btn-primary d-block">
                                                Set Stream
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Video Player */}
                    <div className="card">
                        <div className="card-body p-0">
                            <VideoPlayer
                                rtspUrl={rtspUrl}
                                overlays={overlays}
                                onOverlayUpdate={handleOverlayUpdate}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    {/* Overlay Management Panel */}
                    <div className="card">
                        <div className="card-body">
                            <OverlayPanel
                                overlays={overlays}
                                onOverlayCreate={handleOverlayCreate}
                                onOverlayUpdate={handleOverlayUpdate}
                                onOverlayDelete={handleOverlayDelete}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));
