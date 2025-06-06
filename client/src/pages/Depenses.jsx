import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiService from '../services/api';
import './Depenses.css'; // Fichier CSS séparé pour une meilleure organisation
import { Link } from 'react-router-dom';

export default function Depenses() {
  const [depenses, setDepenses] = useState([]);
  const [tags, setTags] = useState([]);
  const [form, setForm] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    description: '', 
    amount: '', 
    tag: '' 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [depensesRes, tagsRes] = await Promise.allSettled([
        apiService.getDepenses(),
        apiService.getTags()
      ]);

      if (depensesRes.status === 'fulfilled') {
        setDepenses(depensesRes.value.data);
      } else {
        console.error('Erreur dépenses:', depensesRes.reason);
        toast.error('Erreur de chargement des dépenses');
      }

      if (tagsRes.status === 'fulfilled') {
        setTags(tagsRes.value.data);
      } else {
        console.error('Erreur tags:', tagsRes.reason);
        toast.error('Erreur de chargement des tags');
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
      toast.error('Erreur de connexion API');
    } finally {
      setIsLoading(false);
    }
  };

  const ajouterDepense = async (e) => {
    e.preventDefault();
    
    if (!form.description || !form.amount || !form.tag) {
      toast.error("Tous les champs sont obligatoires");
      return;
    }

    try {
      setIsLoading(true);
      const nouvelleDepense = await apiService.createDepense({
        amount: parseFloat(form.amount).toFixed(2),
        description: form.description,
        date: form.date,
        tag_names: [form.tag]
      });

      setDepenses(prev => [nouvelleDepense.data, ...prev]);
      setForm({ ...form, description: '', amount: '', tag: '' });
      toast.success("Dépense ajoutée avec succès !");
    } catch (error) {
      console.error('Erreur ajout:', error);
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'ajout');
    } finally {
      setIsLoading(false);
    }
  };

  const supprimerDepense = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette dépense ?")) return;
    
    try {
      setIsLoading(true);
      await apiService.deleteDepense(id);
      setDepenses(prev => prev.filter(depense => depense.id !== id));
      toast.success("Dépense supprimée avec succès !");
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur de suppression');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les dépenses selon l'onglet actif et la recherche
  const filteredDepenses = depenses.filter(depense => {
    const matchesSearch = depense.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (depense.tags?.[0]?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'recent') {
      const depenseDate = new Date(depense.date);
      const today = new Date();
      const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
      return matchesSearch && depenseDate >= lastMonth;
    }
    return matchesSearch && depense.tags?.[0]?.name === activeTab;
  });

  // Calculer le total des dépenses affichées
  const totalAmount = filteredDepenses.reduce((sum, depense) => sum + parseFloat(depense.amount), 0);

  return (
    <div className="depenses-app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="app-logo">💰 Gestion</h1>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Accueil</span>
          </Link>
          <Link to="/depenses" className="nav-item active">
            <span className="nav-icon">💸</span>
            <span className="nav-text">Dépenses</span>
          </Link>
          <Link to="/tags" className="nav-item">
            <span className="nav-icon">🏷️</span>
            <span className="nav-text">Catégories</span>
          </Link>
          <Link to="/analytics" className="nav-item">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Analytiques</span>
          </Link>
          <Link to="/budgets" className="nav-item">
            <span className="nav-icon">🎯</span>
            <span className="nav-text">Budgets</span>
          </Link>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">👤</div>
            <div className="user-info">
              <span className="username">Utilisateur</span>
              <span className="user-email">user@example.com</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="content-area">
        {/* Header */}
        <header className="content-header">
          <h2 className="page-title">
            <span className="page-icon">💸</span>
            Gestion des Dépenses
          </h2>
          
          <div className="header-actions">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Rechercher des dépenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
            <button className="btn-export">
              <span className="export-icon">📤</span>
              Exporter
            </button>
          </div>
        </header>

        {/* Dashboard Cards */}
        <div className="dashboard-cards">
          <div className="stats-card total">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h3>Total dépensé</h3>
              <p>{totalAmount.toFixed(2)} €</p>
            </div>
          </div>
          
          <div className="stats-card count">
            <div className="card-icon">📋</div>
            <div className="card-content">
              <h3>Nombre de dépenses</h3>
              <p>{filteredDepenses.length}</p>
            </div>
          </div>
          
          <div className="stats-card average">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>Moyenne par dépense</h3>
              <p>
                {filteredDepenses.length > 0 
                  ? (totalAmount / filteredDepenses.length).toFixed(2) 
                  : '0.00'} €
              </p>
            </div>
          </div>
        </div>

        {/* Form and Table Section */}
        <div className="content-grid">
          {/* Add Expense Form */}
          <section className="form-section">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">➕</span>
                Ajouter une dépense
              </h3>
            </div>
            
            <form onSubmit={ajouterDepense} className="expense-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    value={form.date}
                    onChange={e => setForm({...form, date: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Montant (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={e => setForm({...form, amount: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Repas, transport, shopping..."
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Catégorie</label>
                {tags.length > 0 ? (
                  <select
                    value={form.tag}
                    onChange={e => setForm({...form, tag: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {tags.map(tag => (
                      <option key={tag.id} value={tag.name}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Alimentation, loisirs..."
                    value={form.tag}
                    onChange={e => setForm({...form, tag: e.target.value})}
                    className="form-input"
                    required
                  />
                )}
              </div>

              <button 
                type="submit" 
                className="btn-submit"
                disabled={isLoading}
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer la dépense'}
              </button>
            </form>
          </section>

          {/* Expenses Table */}
          <section className="table-section">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">📜</span>
                Historique des dépenses
              </h3>
              
              <div className="tabs">
                <button 
                  className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  Toutes
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
                  onClick={() => setActiveTab('recent')}
                >
                  Récentes
                </button>
                {tags.slice(0, 3).map(tag => (
                  <button 
                    key={tag.id}
                    className={`tab-btn ${activeTab === tag.name ? 'active' : ''}`}
                    onClick={() => setActiveTab(tag.name)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="table-container">
              {isLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Chargement des dépenses...</p>
                </div>
              ) : filteredDepenses.length > 0 ? (
                <table className="expenses-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Montant</th>
                      <th>Catégorie</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepenses.map(depense => (
                      <tr key={depense.id} className="expense-row">
                        <td>
                          <div className="date-cell">
                            <span className="day">{new Date(depense.date).getDate()}</span>
                            <span className="month">{new Date(depense.date).toLocaleString('fr-FR', { month: 'short' })}</span>
                          </div>
                        </td>
                        <td>{depense.description}</td>
                        <td className="amount-cell">
                          <span className="amount">-{parseFloat(depense.amount).toFixed(2)} €</span>
                        </td>
                        <td>
                          {depense.tags && depense.tags.length > 0 ? (
                            <span 
                              className="tag" 
                              style={{ 
                                backgroundColor: `${depense.tags[0].color}20`,
                                color: depense.tags[0].color,
                                border: `1px solid ${depense.tags[0].color}`
                              }}
                            >
                              {depense.tags[0].name}
                            </span>
                          ) : (
                            <span className="tag no-tag">Non catégorisé</span>
                          )}
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button className="btn-edit">
                              <span className="icon">✏️</span>
                            </button>
                            <button 
                              className="btn-delete"
                              onClick={() => supprimerDepense(depense.id)}
                            >
                              <span className="icon">🗑️</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h4>Aucune dépense trouvée</h4>
                  <p>Commencez par ajouter une nouvelle dépense</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}