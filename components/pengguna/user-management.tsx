"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PlusCircle, Loader2, Trash2, Edit2 } from "lucide-react";
import { formatDateIndonesia } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

interface UserData {
  id: string;
  name: string;
  username: string;
  role: string;
  createdAt: string;
}

interface Props {
  userRole: string;
  targetRoleName: string;
}

export function UserManagement({ userRole, targetRoleName }: Props) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ id: "", name: "", username: "", password: "" });
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/api/users");
      const json = await res.json();
      if (json.success) {
        setUsers(json.data);
      } else {
        toast.error(json.error);
      }
    } catch (e) {
      toast.error("Gagal mengambil data pengguna");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setFormData({ id: "", name: "", username: "", password: "" });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserData) => {
    setFormData({ id: user.id, name: user.name, username: user.username, password: "" });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus pengguna ${name}?`)) return;
    
    try {
      const res = await apiFetch(`/api/users/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        fetchUsers();
      } else {
        toast.error(json.error);
      }
    } catch (e) {
      toast.error("Gagal menghapus pengguna");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = isEditMode ? `/api/users/${formData.id}` : "/api/users";
      const method = isEditMode ? "PUT" : "POST";
      
      const payload = isEditMode 
        ? { name: formData.name, password: formData.password || undefined }
        : { name: formData.name, username: formData.username, password: formData.password };
        
      const res = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        setIsModalOpen(false);
        fetchUsers();
      } else {
        toast.error(json.error);
      }
    } catch (e) {
      toast.error("Gagal menyimpan pengguna");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
          Daftar {targetRoleName}
        </h2>
        <button onClick={handleOpenAdd} className="btn-primary">
          <PlusCircle size={20} />
          <span>Tambah</span>
        </button>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Username</th>
                <th>Dibuat Pada</th>
                <th style={{ textAlign: "right", width: "100px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "32px" }}>
                    <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto", color: "var(--primary)" }} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                    Belum ada data pengguna
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 600 }}>{user.name}</td>
                    <td style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--text-secondary)" }}>{user.username}</td>
                    <td>{formatDateIndonesia(new Date(user.createdAt))}</td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(217,119,6,0.15)",
                            color: "#D97706",
                            transition: "transform 0.15s"
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id, user.name)}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(220,38,38,0.15)",
                            color: "#DC2626",
                            transition: "transform 0.15s"
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="animate-fade-in" style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <div className="card animate-slide-in" style={{ width: "100%", maxWidth: "450px", padding: "24px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 24px 0", color: "var(--text-primary)" }}>
              {isEditMode ? "Edit Pengguna" : `Tambah ${targetRoleName}`}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "14px", fontWeight: 600 }}>Nama Lengkap</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData(p => ({...p, name: e.target.value}))}
                  className="input"
                  required
                />
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "14px", fontWeight: 600 }}>Username</label>
                <input 
                  type="text" 
                  value={formData.username} 
                  onChange={(e) => setFormData(p => ({...p, username: e.target.value}))}
                  className="input"
                  style={isEditMode ? { backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" } : {}}
                  required
                  disabled={isEditMode}
                />
                {isEditMode && <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>Username tidak dapat diubah</p>}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "14px", fontWeight: 600 }}>
                  {isEditMode ? "Password Baru (Kosongkan jika tidak diubah)" : "Password"}
                </label>
                <input 
                  type="password" 
                  value={formData.password} 
                  onChange={(e) => setFormData(p => ({...p, password: e.target.value}))}
                  className="input"
                  required={!isEditMode}
                  minLength={4}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="btn-outline"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}