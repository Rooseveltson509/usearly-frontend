import React, { useState, useEffect } from 'react';
import { fetchReports } from '../services/apiService';
import { ReportsResponse, Reports } from '../types/Reports';
import './Reports.scss';

const ReportsTest: React.FC = () => {
  const [reports, setReports] = useState<Reports[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const { reports, totalPages } = await fetchReports(currentPage, 5);
      console.log("Rapports chargés :", reports); // Affiche les rapports chargés
      setReports(reports);
      setTotalPages(totalPages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="reports-container">
      <h1>Rapports des utilisateurs</h1>
      {loading && <p>Chargement des rapports...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <>
          <ul className="reports-list">
            {reports.map((report) => (
              <li key={report.id} className="report-card">
                <h3>{report.marque}</h3>
                <p><strong>Emplacement :</strong> {report.bugLocation}</p>
                <p><strong>Description :</strong> {report.description}</p>
                <p><strong>Bloquant :</strong> {report.blocking}</p>
                <p><strong>Utilisateur :</strong> {report.User.pseudo} ({report.User.email})</p>
                <p><strong>Ajouté le :</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <span>Page {currentPage} sur {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsTest;
