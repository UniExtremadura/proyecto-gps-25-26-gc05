import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { getUserProfile, updateUserProfile } from "../api/usersApi";

const Profile = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado para edición
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    avatarUrl: "",
    bio: ""
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile(user.userId);
        setProfile(data);

        // precargar formulario
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

  if (loading) return <p className="p-10">Cargando perfil...</p>;
  if (!profile) return <p className="p-10">No se pudo cargar el perfil.</p>;

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Mi Perfil</h1>

      <div className="bg-white shadow-lg rounded-xl p-8">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <img
            src={profile.avatarUrl || profile.avatar_url || "https://i.pinimg.com/236x/bc/8f/29/bc8f29c4183345bcc63bd4a161e88c71.jpg"}
            alt="avatar"
            className="w-40 h-40 rounded-full object-cover shadow-md"
          />
        </div>

        {/* Datos */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">
            {profile.displayName || profile.display_name || "Nombre no definido"}
          </h2>
          <p className="text-gray-600 mt-2">
            {profile.bio || "Sin biografía"}
          </p>
        </div>

        {/* Botón Editar */}
        {!isEditing && (
          <div className="text-center">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Editar perfil
            </button>
          </div>
        )}

        {/* FORMULARIO DE EDICIÓN */}
        {isEditing && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block font-semibold">Nombre público</label>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) =>
                  setForm({ ...form, displayName: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold">URL del avatar</label>
              <input
                type="text"
                value={form.avatarUrl}
                onChange={(e) =>
                  setForm({ ...form, avatarUrl: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold">Biografía</label>
              <textarea
                value={form.bio}
                onChange={(e) =>
                  setForm({ ...form, bio: e.target.value })
                }
                rows={3}
                className="w-full border p-2 rounded"
              ></textarea>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Guardar cambios
              </button>

              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
