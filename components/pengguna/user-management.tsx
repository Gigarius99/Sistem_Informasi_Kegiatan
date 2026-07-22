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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl">Daftar {targetRoleName}</h2>
        <button onClick={handleOpenAdd} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <PlusCircle size={20} /> Tambah
        </button>
      </div>

      <div className="rounded-xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ backgroundColor: "var(--color-surface-2)" }}>
                <th className="px-6 py-4 font-semibold text-sm">Nama</th>
                <th className="px-6 py-4 font-semibold text-sm">Username</th>
                <th className="px-6 py-4 font-semibold text-sm">Dibuat Pada</th>
                <th className="px-6 py-4 font-semibold text-sm text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <Loader2 size={24} className="animate-spin mx-auto" style={{ color: "var(--color-primary)" }} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center" style={{ color: "var(--color-text-muted)" }}>
                    Belum ada data pengguna
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4 font-mono text-sm">{user.username}</td>
                    <td className="px-6 py-4 text-sm">{formatDateIndonesia(new Date(user.createdAt))}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenEdit(user)}
                        className="p-2 rounded-lg hover:bg-black/5" 
                        title="Edit"
                      >
                        <Edit2 size={18} style={{ color: "var(--color-primary)" }} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id, user.name)}
                        className="p-2 rounded-lg hover:bg-black/5" 
                        title="Hapus"
                      >
                        <Trash2 size={18} style={{ color: "#DC2626" }} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
          <div className="w-full max-w-md rounded-2xl p-6 shadow-xl" style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-card-border)" }}>
            <h2 className="text-xl font-bold mb-6">
              {isEditMode ? "Edit Pengguna" : `Tambah ${targetRoleName}`}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData(p => ({...p, name: e.target.value}))}
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-[var(--color-input-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1">Username</label>
                <input 
                  type="text" 
                  value={formData.username} 
                  onChange={(e) => setFormData(p => ({...p, username: e.target.value}))}
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-[var(--color-input-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] w-full bg-gray-50"
                  required
                  disabled={isEditMode}
                />
                {isEditMode && <p className="text-xs mt-1 text-gray-500">Username tidak dapat diubah</p>}
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  {isEditMode ? "Password Baru (Kosongkan jika tidak diubah)" : "Password"}
                </label>
                <input 
                  type="password" 
                  value={formData.password} 
                  onChange={(e) => setFormData(p => ({...p, password: e.target.value}))}
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-[var(--color-input-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] w-full"
                  required={!isEditMode}
                  minLength={4}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold"
                  style={{ backgroundColor: "var(--color-surface)", color: "var(--color-text)" }}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}