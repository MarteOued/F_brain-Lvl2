import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import apiService from '../services/api';
import './Tags.css';

// Palette de couleurs professionnelles
const COLOR_PALETTE = [
  { bg: '#FFEBEE', text: '#C62828', name: 'Rouge' },
  { bg: '#F3E5F5', text: '#7B1FA2', name: 'Violet' },
  { bg: '#E8EAF6', text: '#303F9F', name: 'Bleu foncé' },
  { bg: '#E3F2FD', text: '#0277BD', name: 'Bleu clair' },
  { bg: '#E0F7FA', text: '#00838F', name: 'Turquoise' },
  { bg: '#E8F5E9', text: '#2E7D32', name: 'Vert' },
  { bg: '#FFF8E1', text: '#F57F17', name: 'Jaune' },
  { bg: '#FBE9E7', text: '#D84315', name: 'Orange' },
  { bg: '#EFEBE9', text: '#4E342E', name: 'Marron' },
  { bg: '#ECEFF1', text: '#37474F', name: 'Gris' },
];

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState({
    name: '',
    color: COLOR_PALETTE[0]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editTagData, setEditTagData] = useState({});

  // Charger les tags
  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getTags();
      const processedTags = response.data.map(tag => ({
        ...tag,
        color: COLOR_PALETTE.find(c => c.text === tag.color) || COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]
      }));
      setTags(processedTags);
    } catch (error) {
      console.error('Error loading tags:', error);
      toast.error('Erreur de chargement des tags');
    } finally {
      setIsLoading(false);
    }
  };

  const createTag = async () => {
    if (!newTag.name.trim()) {
      toast.error('Le nom du tag est requis');
      return;
    }

    try {
      setIsLoading(true);
      const tagData = {
        name: newTag.name.trim(),
        color: newTag.color.text
      };
      
      const response = await apiService.createTag(tagData);
      const createdTag = {
        ...response.data,
        color: COLOR_PALETTE.find(c => c.text === response.data.color) || newTag.color
      };
      
      setTags(prev => [...prev, createdTag]);
      setNewTag({ name: '', color: COLOR_PALETTE[0] });
      toast.success(`Tag "${createdTag.name}" créé`);
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error(error.response?.data?.detail || 'Erreur de création');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTag = async () => {
    if (!editTagData.name.trim()) {
      toast.error('Le nom du tag est requis');
      return;
    }

    try {
      setIsLoading(true);
      const tagData = {
        name: editTagData.name.trim(),
        color: editTagData.color.text
      };
      
      const response = await apiService.updateTag(editMode, tagData);
      const updatedTag = {
        ...response.data,
        color: COLOR_PALETTE.find(c => c.text === response.data.color) || editTagData.color
      };
      
      setTags(prev => prev.map(t => t.id === editMode ? updatedTag : t));
      cancelEdit();
      toast.success(`Tag "${updatedTag.name}" mis à jour`);
    } catch (error) {
      console.error('Error updating tag:', error);
      toast.error(error.response?.data?.detail || 'Erreur de mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTag = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce tag ?')) return;

    try {
      setIsLoading(true);
      await apiService.deleteTag(id);
      setTags(prev => prev.filter(t => t.id !== id));
      toast.info('Tag supprimé');
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Erreur de suppression');
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (tag) => {
    setEditMode(tag.id);
    setEditTagData({
      name: tag.name,
      color: tag.color
    });
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditTagData({});
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsage = tags.reduce((sum, tag) => sum + (tag.usage_count || 0), 0);

  return (
    <div className="tags-app">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <h1 className="app-logo">
            <span className="logo-icon">💰</span>
            <span className="logo-text">BudgetZen</span>
          </h1>
          <p className="app-subtitle">Gestion financière intelligente</p>
        </div>

        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Tableau de bord</span>
          </Link>
          <Link to="/depenses" className="nav-item">
            <span className="nav-icon">💸</span>
            <span className="nav-text">Dépenses</span>
          </Link>
          <Link to="/tags" className="nav-item active">
            <span className="nav-icon">🏷️</span>
            <span className="nav-text">Tags</span>
          </Link>
          <Link to="/analytics" className="nav-item">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Analyses</span>
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
              <span className="username">Votre Compte</span>
              <span className="user-email">user@example.com</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="tags-content">
        {/* Header */}
        <header className="content-header">
          <div className="header-title">
            <h2>
              <span className="title-icon">🏷️</span>
              Gestion des Tags
            </h2>
            <p className="header-subtitle">
              Organisez vos dépenses avec des tags personnalisés
            </p>
          </div>

          <div className="header-actions">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Rechercher des tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Tags actifs</h3>
              <p>{tags.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔗</div>
            <div className="stat-info">
              <h3>Utilisation totale</h3>
              <p>{totalUsage}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎨</div>
            <div className="stat-info">
              <h3>Couleurs disponibles</h3>
              <p>{COLOR_PALETTE.length}</p>
            </div>
          </div>
        </div>

        {/* Tag Creation Section */}
        <section className="tag-creation">
          <div className="section-header">
            <h3 className="section-title">
              {editMode ? '✏️ Modifier un tag' : '➕ Créer un nouveau tag'}
            </h3>
          </div>

          <div className="creation-form">
            <div className="form-group">
              <label>Nom du tag</label>
              <input
                type="text"
                placeholder="Ex: Alimentation, Transport..."
                value={editMode ? editTagData.name : newTag.name}
                onChange={(e) => 
                  editMode 
                    ? setEditTagData({...editTagData, name: e.target.value})
                    : setNewTag({...newTag, name: e.target.value})
                }
                onKeyDown={(e) => e.key === 'Enter' && (editMode ? updateTag() : createTag())}
              />
            </div>

            <div className="form-group">
              <label>Couleur</label>
              <div className="color-picker">
                {(editMode ? [editTagData.color] : [newTag.color]).map((color, idx) => (
                  <div 
                    key={idx}
                    className="color-selection"
                    style={{ backgroundColor: color.bg, color: color.text }}
                  >
                    {color.name}
                  </div>
                ))}
                <div className="color-options">
                  {COLOR_PALETTE.map((color, index) => (
                    <button
                      key={index}
                      className="color-option"
                      style={{ backgroundColor: color.bg, color: color.text }}
                      onClick={() => 
                        editMode
                          ? setEditTagData({...editTagData, color})
                          : setNewTag({...newTag, color})
                      }
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="form-actions">
              {editMode ? (
                <>
                  <button 
                    className="btn-cancel"
                    onClick={cancelEdit}
                  >
                    Annuler
                  </button>
                  <button 
                    className="btn-save"
                    onClick={updateTag}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </>
              ) : (
                <button 
                  className="btn-create"
                  onClick={createTag}
                  disabled={isLoading || !newTag.name.trim()}
                >
                  {isLoading ? 'Création...' : 'Créer le tag'}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Tags List Section */}
        <section className="tags-list">
          <div className="section-header">
            <h3 className="section-title">📌 Vos tags</h3>
            <span className="tags-count">
              {filteredTags.length} tag{filteredTags.length !== 1 ? 's' : ''}
            </span>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Chargement des tags...</p>
            </div>
          ) : filteredTags.length > 0 ? (
            <div className="tags-grid">
              {filteredTags.map(tag => (
                <div 
                  key={tag.id} 
                  className="tag-card"
                  style={{ 
                    backgroundColor: tag.color.bg,
                    color: tag.color.text,
                    borderLeft: `4px solid ${tag.color.text}`
                  }}
                >
                  <div className="tag-info">
                    <h4 className="tag-name">{tag.name}</h4>
                    {tag.usage_count > 0 && (
                      <span className="tag-usage">
                        Utilisé {tag.usage_count} fois
                      </span>
                    )}
                  </div>

                  <div className="tag-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => startEdit(tag)}
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => deleteTag(tag.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏷️</div>
              <h4>Aucun tag trouvé</h4>
              <p>
                {searchTerm 
                  ? 'Aucun tag ne correspond à votre recherche'
                  : 'Commencez par créer votre premier tag'}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}