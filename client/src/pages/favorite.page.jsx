import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Card from "../components/card";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import HomeStyles from "../components/HomeStyles";

export default function FavoritePage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user's favorite devices
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/favorites", {
          headers: {
            Authorization: `${token}`,
          },
        });

        setFavorites(response.data);
        setLoading(false);
      } catch (err) {
        setError("Gagal mengambil data favorit");
        setLoading(false);
        console.error("Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [navigate]);

  // Handler untuk klik tombol View Details
  const handleCardClick = (phoneId) => {
    navigate(`/devices/${phoneId}`);
  };

  return (
    <>
      <HomeStyles />
      <Navbar />

      <div className="container mt-5">
        <h1 className="mb-4">Daftar HP Favorit</h1>

        {/* Menampilkan error jika ada */}
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <LoadingSpinner />
        ) : favorites.length === 0 ? (
          <div className="alert alert-info">
            Anda belum memiliki HP favorit. Kembali ke{" "}
            <a href="/">halaman utama</a> untuk menambahkan.
          </div>
        ) : (
          <div className="row">
            {favorites.map((favorite) => (
              <div className="col-md-3 col-sm-6 mb-4" key={favorite.id}>
                <Card
                  title={favorite.XiaomiDevice.device_name}
                  imageUrl={favorite.XiaomiDevice.device_image}
                  isFeatured={false}
                  price={favorite.XiaomiDevice.price}
                  onClick={() => handleCardClick(favorite.XiaomiDevice.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
