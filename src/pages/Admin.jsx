import AdminUpload from '../components/AdminUpload';
import './Admin.css';

export default function Admin() {
  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="container">
          <span className="section-label">Mission Control</span>
          <h1 className="page-title">Admin</h1>
          <p className="page-desc">
            Upload recordings, trigger acoustic analysis, and manage the archive.
          </p>
        </div>
      </div>

      <section className="admin-section">
        <div className="container">
          <span className="section-label">Upload Pipeline</span>
          <span className="gold-bar" />
          <AdminUpload />
        </div>
      </section>
    </div>
  );
}
