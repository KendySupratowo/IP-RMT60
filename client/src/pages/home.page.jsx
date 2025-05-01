import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import ErrorMessage from "../components/ErrorMessage";
import FeaturedDevices from "../components/FeaturedDevices";
import AllDevices from "../components/AllDevices";
import HomeStyles from "../components/HomeStyles";
import WelcomeContent from "../components/WelcomeContent";

export default function HomePage() {
  // State untuk menyimpan data HP
  const [devices, setDevices] = useState([]);
  const [featuredDevices, setFeaturedDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fungsi untuk mengambil data dari API
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3000/public/devices"
        );

        // Simpan semua device ke state
        setDevices(response.data);

        // Filter device unggulan
        const shuffledDevices = response.data.sort(() => 0.5 - Math.random());
        setFeaturedDevices(shuffledDevices.slice(0, 4));

        setLoading(false);
      } catch (err) {
        setError("Gagal mengambil data dari server");
        setLoading(false);
        console.error("Error fetching devices:", err);
      }
    };

    fetchDevices();
  }, []);

  // Handler untuk klik tombol View Details
  const handleCardClick = (phoneId) => {
    // Navigasi ke halaman detail dengan parameter ID HP
    navigate(`/devices/${phoneId}`);
  };

  return (
    <>
      <HomeStyles />
      <Navbar />

      {/* Menampilkan error jika ada */}
      {error && <ErrorMessage message={error} />}

      {/* HP Unggulan */}
      <FeaturedDevices
        devices={featuredDevices}
        loading={loading}
        onCardClick={handleCardClick}
      />

      {/* Daftar Semua HP */}
      <AllDevices
        devices={devices}
        loading={loading}
        onCardClick={handleCardClick}
      />
    </>
  );
}
