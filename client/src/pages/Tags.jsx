import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const colors = [
  { bg: '#fee2e2', text: '#b91c1c' },   // rouge
  { bg: '#dbeafe', text: '#1e40af' },   // bleu
  { bg: '#d1fae5', text: '#065f46' },   // vert
  { bg: '#fef3c7', text: '#92400e' },   // jaune
  { bg: '#ede9fe', text: '#5b21b6' },   // violet
  { bg: '#fce7f3', text: '#9d174d' },   // rose
  { bg: '#e0f2fe', text: '#0369a1' },   // bleu clair
  { bg: '#dcfce7', text: '#166534' },   // vert foncé
];

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  // Charger les tags depuis localStorage
  useEffect(() => {
    const savedTags = localStorage.getItem('tags');
    if (savedTags) {
      setTags(JSON.parse(savedTags));
    }
  }, []);

  // Sauvegarder les tags dans localStorage
  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [tags]);

  const ajouterTag = () => {
    const nomTag = newTag.trim();
    if (!nomTag) {
      toast.error("Le nom du tag ne peut pas être vide");
      return;
    }

    if (tags.some(tag => tag.nom.toLowerCase() === nomTag.toLowerCase())) {
      toast.error("Ce tag existe déjà");
      return;
    }

    const couleur = colors[Math.floor(Math.random() * colors.length)];
    setTags([...tags, { id: Date.now(), nom: nomTag, couleur }]);
    setNewTag('');
    toast.success(`Tag "${nomTag}" ajouté !`);
  };

  const supprimerTag = (id) => {
    const tagToDelete = tags.find(tag => tag.id === id);
    setTags(tags.filter(tag => tag.id !== id));
    toast.info(`Tag "${tagToDelete.nom}" supprimé`);
  };

  return (
    <>
      <div className="container">
        <h1 className="page-title">🏷️ Gestion des Tags</h1>

        <section className="form-section">
          <h2 className="section-title">➕ Créer un nouveau tag</h2>

          <div className="form-row">
            <div className="form-group">
              <label className="input-label">Nom du tag</label>
              <input
                type="text"
                placeholder="Ex: Alimentation, Transport..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="input-field"
                onKeyDown={e => e.key === 'Enter' && ajouterTag()}
              />
            </div>

            <button 
              onClick={ajouterTag}
              className="btn-primary"
              aria-label="Créer le tag"
            >
              Créer le tag
            </button>
          </div>
        </section>

        <section className="tags-section">
          <div className="section-header">
            <h2 className="section-title">📌 Vos tags</h2>
            {tags.length > 0 && (
              <span className="tag-count">{tags.length} tag{tags.length > 1 ? 's' : ''}</span>
            )}
          </div>

          {tags.length > 0 ? (
            <div className="tags-grid">
              {tags.map(tag => (
                <div 
                  key={tag.id} 
                  className="tag-card"
                  style={{ 
                    backgroundColor: tag.couleur.bg, 
                    color: tag.couleur.text,
                    borderLeft: `4px solid ${tag.couleur.text}`
                  }}
                >
                  <span className="tag-name">{tag.nom}</span>
                  <button 
                    onClick={() => supprimerTag(tag.id)}
                    className="btn-delete"
                    aria-label={`Supprimer le tag ${tag.nom}`}
                    style={{ color: tag.couleur.text }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v14.25A2.25 2.25 0 005.25 22h13.5A2.25 2.25 0 0021 19.75V9.568m-18 0A2.25 2.25 0 015.25 7h13.5A2.25 2.25 0 0121 9.568m-18 0V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v2.818" />
              </svg>
              <p>Vous n'avez pas encore créé de tags</p>
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        html, body, #root {
          height: 100%;
          width: 100%;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #f8fafc;
          color: #1e293b;
        }
        
        .container {
          min-height: 100vh;
          width: 100%;
          padding: 3rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 auto;
          max-width: 1200px;
        }
        
        .page-title {
          font-size: 3rem;
          font-weight: 800;
          color: #2563eb;
          margin-bottom: 2.5rem;
          text-align: center;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }
        
        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e40af;
        }
        
        .form-section, .tags-section {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 2rem;
          width: 100%;
          margin-bottom: 2rem;
        }
        
        .form-row {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        @media(min-width: 640px) {
          .form-row {
            flex-direction: row;
            align-items: flex-end;
          }
        }
        
        .form-group {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        
        .input-label {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #334155;
          font-size: 1rem;
        }
        
        .input-field {
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.2s ease;
          outline: none;
          width: 100%;
        }
        
        .input-field:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .btn-primary {
          background-color: #2563eb;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          height: fit-content;
        }
        
        .btn-primary:hover {
          background-color: #1e40af;
          transform: translateY(-1px);
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .tag-count {
          font-size: 0.875rem;
          color: #64748b;
          background: #f1f5f9;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
        }
        
        .tags-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }
        
        .tag-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: all 0.2s ease;
          cursor: default;
        }
        
        .tag-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .tag-name {
          overflow-wrap: anywhere;
          padding-right: 0.5rem;
        }
        
        .btn-delete {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          transition: all 0.2s ease;
          opacity: 0.7;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .btn-delete:hover {
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: #94a3b8;
          text-align: center;
          gap: 1rem;
        }
        
        .empty-state p {
          font-size: 1.125rem;
          max-width: 300px;
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 2rem 1rem;
          }
          
          .page-title {
            font-size: 2.25rem;
          }
          
          .form-section, .tags-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}