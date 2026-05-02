import { useState, useRef, useCallback } from 'react';
import './AdminUpload.css';

export default function AdminUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState([]);
  const inputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file) => {
    const id = Date.now() + Math.random();
    const upload = {
      id,
      name: file.name,
      size: formatBytes(file.size),
      status: 'pending',
      progress: 0,
    };
    setUploads(prev => [upload, ...prev]);

    // Simulate upload + processing
    setTimeout(() => {
      setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'processing', progress: 50 } : u));
    }, 800);

    setTimeout(() => {
      setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'completed', progress: 100 } : u));
    }, 2500);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.filter(f => f.name.endsWith('.wav')).forEach(processFile);
  }, [processFile]);

  const handleChange = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    files.filter(f => f.name.endsWith('.wav')).forEach(processFile);
  }, [processFile]);

  return (
    <div className="admin-upload">
      <div className="au-header">
        <span className="au-title">Upload Recordings</span>
      </div>

      <div
        className={`au-dropzone${isDragging ? ' dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className="au-dropzone-icon">📁</div>
        <p className="au-dropzone-text">Drop WAV files here or click to browse</p>
        <p className="au-dropzone-hint">Maximum file size: 50MB</p>
        <input
          ref={inputRef}
          type="file"
          accept=".wav,audio/wav"
          multiple
          style={{ display: 'none' }}
          onChange={handleChange}
        />
      </div>

      {uploads.length > 0 && (
        <div className="au-list">
          {uploads.map(u => (
            <div key={u.id} className="au-item">
              <div className={`au-item-status au-item-status--${u.status}`} />
              <span className="au-item-name">{u.name}</span>
              <span className="au-item-size">{u.size}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
