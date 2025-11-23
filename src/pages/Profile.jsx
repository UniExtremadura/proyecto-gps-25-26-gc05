// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { getUserProfile } from "../api/usersApi";

const Profile = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile(user.userId);
        setProfile(data);
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) loadProfile();
  }, [user]);

  if (loading) return <p>Cargando perfil...</p>;
  if (!profile) return <p>No se pudo cargar el perfil.</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Perfil</h1>

      <p><strong>ID:</strong> {profile.userId}</p>
      <p><strong>Nombre público:</strong> {profile.displayName || "Sin definir"}</p>
      <p><strong>Avatar:</strong> {profile.avatarUrl || "Sin avatar"}</p>
      <p><strong>Bio:</strong> {profile.bio || "Sin biografía"}</p>
    </div>
  );
};

export default Profile;
