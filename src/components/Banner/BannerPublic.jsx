import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function BannerPublic() {
  const [banner, setBanner] = useState(null);

  const fetchBanner = async () => {
    try {
      const res = await api.get("/banners/all");
      if (res.data.length > 0) {
        const b = res.data[0];

        // Convertir buffer a Base64
        const base64Image = `data:image/jpeg;base64,${b.image}`;

        setBanner({
          title: b.title,
          link: b.link,
          image: base64Image,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  if (!banner) return null;

  return (
    <div className="w-full">
      <a href={banner.link || "#"} target="_blank" rel="noopener noreferrer">
        <img
          src={banner.image}
          alt={banner.title}
          className="w-full object-cover max-h-72 shadow"
        />
      </a>
    </div>
  );
}
