import React, { useEffect, useState } from "react";
import "./BrandList.scss";
import { deleteBrand, fetchBrands } from "@src/services/apiService";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaExclamationTriangle } from "react-icons/fa";
import EditBrand from "../editBrand/EditBrand";
import CreateBrand from "../createBrand/CreateBrand";
import { Brand } from "@src/types/types";
import Modal from "react-modal";

const BrandList: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // ✅ Nouveau state pour gérer le modal d'ajout
  const [pageTransition, setPageTransition] = useState(false);

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 🔥 Nombre d'éléments par page

  useEffect(() => {
    const getBrands = async () => {
      try {
        const data = await fetchBrands();
        setBrands(data);
        setFilteredBrands(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des marques :", err);
        setError("Impossible de récupérer les marques.");
      } finally {
        setLoading(false);
      }
    };

    getBrands();
  }, []);

  // ✅ Effet pour l'animation lors du changement de page
  const changePage = (newPage: number) => {
    if (newPage !== currentPage) {
      setPageTransition(true);
      setTimeout(() => {
        setCurrentPage(newPage);
        setPageTransition(false);
      }, 300); // Durée de l'animation en millisecondes (0.3s)
    }
  };

  // 🚀 Filtrage des marques en fonction de la recherche
  useEffect(() => {
    const filtered = brands.filter(brand =>
      brand.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredBrands(filtered);
    setCurrentPage(1); // 🔥 Reset la page quand on recherche
  }, [search, brands]);

  // ✅ Calcul des marques affichées pour la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);

  // ✅ Gestion des boutons de pagination
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  /*   const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1)); */

  const handleEdit = (brand: Brand) => {
    setSelectedBrand({
      ...brand,
      mdp: "", // On évite d'afficher le mot de passe
    });
  };

  // 🚀 Fonction pour ouvrir le modal de suppression
  const openDeleteModal = (brand: Brand) => {
    setSelectedBrand(brand);
    setModalIsOpen(true);
  };

  // 🚀 Fonction pour fermer les modals
  const closeDeleteModal = () => {
    setSelectedBrand(null);
    setModalIsOpen(false);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // 🚀 Fonction pour confirmer la suppression
  const confirmDelete = async () => {
    if (!selectedBrand) return;

    const response = await deleteBrand(selectedBrand.id);
    if (response.success) {
      setBrands(brands.filter(brand => brand.id !== selectedBrand.id));
    } else {
      alert(response.error || "Une erreur est survenue.");
    }

    closeDeleteModal();
  };

  const handleUpdateSuccess = (updatedBrand: Brand) => {
    setBrands(prevBrands =>
      prevBrands.map(brand => (brand.id === updatedBrand.id ? updatedBrand : brand))
    );
  };

  const handleCreateSuccess = (newBrand: Brand) => {
    setBrands(prevBrands => [...prevBrands, newBrand]);
    closeCreateModal();
  };

  if (loading) return <p className="loading">Chargement des marques...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="brand-list-container">
      <h2>Nos Marques Partenaires</h2>

      {/* ✅ Aligner le bouton et la barre de recherche */}
      <div className="actions-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher une marque..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <button className="add-brand-button" onClick={() => setIsCreateModalOpen(true)}>
          <FaPlus className="plus-icon" /> Ajouter une marque
        </button>
      </div>

      <table className={`brand-table ${pageTransition ? "fade-out" : "fade-in"}`}>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Offre</th>
            <th>Date de Création</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBrands.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty">
                Aucune marque trouvée.
              </td>
            </tr>
          ) : (
            currentBrands.map(brand => (
              <tr key={`${brand.id}-${currentPage}`} className="brand-row">
                <td>
                  <img
                    src={
                      brand.avatar
                        ? `${import.meta.env.VITE_API_BASE_URL}/${brand.avatar}`
                        : "/default-avatar.png"
                    }
                    alt={brand.name}
                    className="brand-logo"
                  />
                </td>
                <td>{brand.name}</td>
                <td>{brand.email}</td>
                <td>{brand.offres}</td>
                <td>{new Date(brand.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                  <button className="edit-btn" onClick={() => handleEdit(brand)}>
                    <FaEdit /> Modifier
                  </button>
                  <button className="delete-btn" onClick={() => openDeleteModal(brand)}>
                    <FaTrash /> Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
            ← Précédent
          </button>
          <span>
            Page {currentPage} sur {totalPages}
          </span>
          <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
            Suivant →
          </button>
        </div>
      )}

      {/* 🚀 Modal d'édition */}
      {selectedBrand && selectedBrand.id && !modalIsOpen && (
        <EditBrand
          brand={selectedBrand}
          onUpdateSuccess={handleUpdateSuccess}
          onClose={() => setSelectedBrand(null)}
        />
      )}

      {/* 🚀 Popup de confirmation */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeDeleteModal}
        className="delete-modal"
        overlayClassName="delete-overlay"
      >
        <FaExclamationTriangle className="warning-icon" />
        <h2>Confirmer la suppression</h2>
        <p>
          Voulez-vous vraiment supprimer la marque <strong>{selectedBrand?.name}</strong> ?
        </p>
        <div className="modal-actions">
          <button className="confirm-btn" onClick={confirmDelete}>
            Oui, supprimer
          </button>
          <button className="cancel-btn" onClick={closeDeleteModal}>
            Annuler
          </button>
        </div>
      </Modal>

      {/* 🚀 Modal d'ajout */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={closeCreateModal}
        className="modal"
        overlayClassName="overlay"
      >
        <CreateBrand onCreateSuccess={handleCreateSuccess} onClose={closeCreateModal} />
      </Modal>
    </div>
  );
};

export default BrandList;
