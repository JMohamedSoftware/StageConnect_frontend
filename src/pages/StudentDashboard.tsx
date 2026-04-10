// Tableau de bord étudiant : profil, CV, candidatures

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import type { Application } from "../types";

// Badge CSS selon le statut de candidature
const statusClass = (status: string) =>
  status === "accepted" ? "badge-status badge-accepted" :
  status === "pending"  ? "badge-status badge-pending"  :
  "badge-status badge-rejected";

const StudentDashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [uploading, setUploading] = useState(false);
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    api.get("/student/applications").then(res => setApplications(res.data)).catch(() => {});
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const fd = new FormData();
    fd.append("cv", e.target.files[0]);
    setUploading(true);
    try {
      await api.post("/student/cv", fd);
      toast.success("CV téléchargé !");
      await refreshUser();
    } catch {
      toast.error("Échec du téléchargement");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="dashboard-grid-3">

        {/* ── Profil + CV ────────────────────────────────────── */}
        <div>
          <div className="card">
            <div className="avatar-block">{user?.name[0]}</div>
            <div className="user-name">{user?.name}</div>
            <div className="user-email">{user?.email}</div>

            <div className="divider-top">
              <div className="resume-label">Votre CV</div>
              {user?.cv_url ? (
                <div className="cv-uploaded">
                  <span className="cv-uploaded-text">CV téléchargé</span>
                  <a href={user.cv_url} target="_blank" rel="noreferrer" className="cv-view-link">Voir</a>
                </div>
              ) : (
                <label className="cv-upload-label">
                  <Upload size={24} />
                  <span>{uploading ? "Envoi en cours..." : "Télécharger le CV (PDF)"}</span>
                  <input type="file" accept=".pdf" style={{ display: "none" }}
                    onChange={handleFileUpload} disabled={uploading} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* ── Mes candidatures ───────────────────────────────── */}
        <div>
          <div className="card">
            <h2 className="card-title">Mes candidatures</h2>
            <div className="applications-list">
              {applications.map(app => (
                <div key={app.id} className="application-item">
                  <div className="application-info">
                    <div className="company-avatar-gray">{app.company_name[0]}</div>
                    <div>
                      <div className="app-title">{app.offer_title}</div>
                      <div className="app-company">{app.company_name}</div>
                    </div>
                  </div>
                  <div className="application-status">
                    <span className={statusClass(app.status)}>{app.status}</span>
                    <span className="app-date">{new Date(app.applied_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}

              {applications.length === 0 && (
                <div className="empty-card">
                  <p>Vous n'avez encore postulé à aucun stage.</p>
                  <Link to="/offers">Parcourir les offres</Link>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
