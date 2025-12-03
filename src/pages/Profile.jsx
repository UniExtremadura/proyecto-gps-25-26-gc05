import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { getUserProfile, updateUserProfile } from "../api/usersApi";

const Profile = () => {
  const { user, isAuthenticated } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    avatarUrl: "",
    bio: ""
  });

  useEffect(() => {
      if (!user?.userId) {
      // Reset al cambiar a "no logueado"
      setProfile(null);
      setLoading(false);
      return;
    }
    const loadProfile = async () => {
      try {
        const data = await getUserProfile(user.userId);
        setProfile(data);

        setForm({
          displayName: data.displayName || data.display_name || "",
          avatarUrl: data.avatarUrl || data.avatar_url || "",
          bio: data.bio || ""
        });

      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) loadProfile();
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUserProfile(user.userId, form);
      setProfile(form);
      setIsEditing(false);
      alert("Perfil actualizado correctamente");
    } catch (err) {
      console.error("Error guardando perfil:", err);
      alert("No se pudo guardar el perfil");
    }
  };

  // === PERFIL VACÍO SI NO HAY SESIÓN ===
  if (!isAuthenticated || !user?.userId) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="bg-white shadow-xl rounded-3xl p-10 max-w-lg text-center">

          <h2 className="text-3xl font-bold mb-4">Perfil no disponible</h2>

          <p className="text-gray-600 mb-6">
            Aún no has iniciado sesión.  
            Cuando accedas podrás ver y editar tu información personal.
          </p>

          <div className="flex flex-col gap-3 items-center">
            <a
              href="/login"
              className="bg-black text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-800 transition"
            >
              Iniciar sesión
            </a>

            <a
              href="/register"
              className="text-black font-semibold underline hover:text-gray-700 transition"
            >
              Crear una cuenta
            </a>
          </div>

        </div>
      </div>
    );
  }

  if (loading) return <p className="p-10">Cargando perfil...</p>;
  if (!profile) return <p className="p-10">No se pudo cargar el perfil.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">

      {/* ===== Banner superior ===== */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-black to-gray-800 text-white py-16 flex flex-col items-center">
        
        <h1 className="text-4xl font-extrabold mb-6">Mi Perfil</h1>

        <img
          src={profile.avatarUrl || profile.avatar_url || "https://i.pinimg.com/236x/bc/8f/29/bc8f29c4183345bcc63bd4a161e88c71.jpg"}
          alt="avatar"
          className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover mb-4"
        />

        <h2 className="text-2xl font-bold tracking-wide">
          {profile.displayName || profile.display_name || "Nombre no definido"}
        </h2>
      </div>

      {/* ===== BIO COMO TARJETA INDEPENDIENTE ===== */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-3">Biografía</h3>

        <p className="text-gray-700 leading-relaxed">
          {profile.bio || "Este usuario no ha escrito una biografía todavía."}
        </p>
      </div>

      {/* ===== INFORMACIÓN GENERAL ===== */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6">Información general</h3>

        <div className="space-y-4">
          <div className="flex justify-between text-gray-800">
            <span className="font-medium">Miembro desde</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>

        {/* Botón editar */}
        <div className="text-right mt-6">
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Editar perfil
          </button>
        </div>
      </div>

      {/* ===== FORMULARIO DE EDICIÓN (no lo toco) ===== */}
      {isEditing && (
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-6">

          <div>
            <label className="block font-semibold mb-1">Nombre público</label>
            <input
              type="text"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">URL del avatar</label>
            <input
              type="text"
              value={form.avatarUrl}
              onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Biografía</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Guardar cambios
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </div>

        </div>
      )}

    </div>
  );

};

export default Profile;
