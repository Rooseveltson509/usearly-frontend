import { useState, useEffect } from "react";
import "./CreatePostPopup.scss";
import { Brand, Post } from "@src/types/types";
import { createPost } from "@src/services/apiService";

interface CreatePostPopupProps {
  brands: Brand[]; // ✅ Liste des marques provenant de `MainContent`
  onClose: () => void;
  onPostCreated: (newPost: Post) => void; // 🔥 Callback pour mettre à jour le mur des posts
}

const CreatePostPopup: React.FC<CreatePostPopupProps> = ({
  brands,
  onClose,
  onPostCreated,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [brandQuery, setBrandQuery] = useState("");
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isValidBrand, setIsValidBrand] = useState(false);
  const [loading, setLoading] = useState(false); // 🔥 Loader pour la soumission

  // 🔍 **Filtrage des marques**
  useEffect(() => {
    if (brandQuery.trim() === "") {
      setFilteredBrands([]);
      setIsValidBrand(false);
    } else {
      const filtered = brands.filter((brand) =>
        brand.name.toLowerCase().includes(brandQuery.toLowerCase())
      );

      setFilteredBrands(filtered);

      // ✅ Vérifie si la marque saisie correspond à une marque existante
      const match = brands.find(
        (brand) => brand.name.toLowerCase() === brandQuery.toLowerCase()
      );
      setIsValidBrand(!!match);
      setSelectedBrand(match || null);
    }
  }, [brandQuery, brands]);

  // ✅ **Sélection d'une marque existante**
const handleBrandSelect = (brand: Brand) => {
  setBrandQuery(brand.name);
  setSelectedBrand(brand);
  setIsValidBrand(true);

  // ✅ Assure que le menu se ferme immédiatement après la sélection
  setTimeout(() => {
    setFilteredBrands([]);
  }, 0);
};


  // 🚀 **Soumission du post**
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); // ✅ Empêche le rechargement de la page
      if (!selectedBrand) return;
      setLoading(true);
      try {
        console.log("🛠 Marque sélectionnée :", selectedBrand?.name);
        console.log("🛠 ID envoyé au backend :", selectedBrand?.id);

        const newPost = await createPost({
          title,
          content,
          marqueId: selectedBrand.id, // ✅ Envoi de `marqueId` au lieu de `brand`
        });

        setLoading(false);
        if (newPost) {
          onPostCreated(newPost);
          onClose();
        }
      } catch (error) {
        console.error("Erreur lors de la création du post :", error);
      } finally {
        setLoading(false);
      }
    };


  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h2>Créer un post</h2>

        <input
          type="text"
          placeholder="Saisir un titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Décrivez votre problème"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="brand-search-container">
          <input
            type="text"
            placeholder="Sélectionnez une marque"
            value={brandQuery}
            onChange={(e) => setBrandQuery(e.target.value)}
          />

          {filteredBrands.length > 0 && (
            <ul className="suggestions">
              {filteredBrands.map((brand) => (
                <li key={brand.id} onClick={() => handleBrandSelect(brand)}>
                  {brand.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="button-group">
          <button onClick={onClose} className="cancel">
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="submit"
            disabled={!isValidBrand || loading}
          >
            {loading ? "Publication..." : "Publier"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPopup;