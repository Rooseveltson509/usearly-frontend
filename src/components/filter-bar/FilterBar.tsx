import React, { useState } from "react";
import "./FilterBar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import searchIcon from "../../assets/icons/search-icon.svg";



interface FilterBarProps {
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  setPostsPage: (page: number) => void;
  onSearchChange: (term: string) => void;
  onSortChange: (sort: string) => void; // ✅ Ajout du callback pour le tri
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedFilter,
  setSelectedFilter,
  setPostsPage,
  onSearchChange,
  onSortChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Date");

  return (
    <div className="filter-bar">
      {/* ✅ Filtre principal */}
      <div
        className={`filter-dropdown ${isDropdownOpen ? "open" : ""}`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <button className="filter-button main-button">
          {selectedFilter}{" "}
          <FontAwesomeIcon icon={faChevronDown} className="chevron-icon" />
        </button>
        {isDropdownOpen && (
          <div className="dropdown-content">
            {["Actualité", "Signalements", "Coup de Cœur", "Suggestions"].map(
              (filter) => (
                <button
                  key={filter}
                  className={`dropdown-item ${
                    selectedFilter === filter ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedFilter(filter);
                    setPostsPage(1);
                    setIsDropdownOpen(false);
                  }}
                >
                  {filter}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* ✅ Filtre secondaire (tri) */}
      <div
        className={`filter-dropdown ${isSortDropdownOpen ? "open" : ""}`}
        onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
      >
        <button className="filter-button secondary-button">
          Filtrer{" "}
          <FontAwesomeIcon icon={faChevronDown} className="chevron-icon" />
        </button>
        {isSortDropdownOpen && (
          <div className="dropdown-content">
            {["Date", "Popularité", "Commentaires"].map((option) => (
              <button
                key={option}
                className={`dropdown-item ${
                  selectedSort === option ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedSort(option);
                  setIsSortDropdownOpen(false);
                  onSortChange(option);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Barre de recherche */}
      <div className="search-container">
        <img src={searchIcon} alt="Rechercher" className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearchChange(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default FilterBar;
