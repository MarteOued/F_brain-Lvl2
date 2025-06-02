import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Depenses() {
  const [depenses, setDepenses] = useState([]);
  const [form, setForm] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    description: '', 
    montant: '', 
    tag: '' 
  });

  // Charger les dépenses depuis localStorage au montage
  useEffect(() => {
    const savedDepenses = localStorage.getItem('depenses');
    if (savedDepenses) {
      setDepenses(JSON.parse(savedDepenses));
    }
  }, []);

  // Sauvegarder les dépenses dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('depenses', JSON.stringify(depenses));
  }, [depenses]);

  const ajouterDepense = () => {
    if (!form.description || !form.montant || !form.tag) {
      toast.error("Tous les champs sont obligatoires");
      return;
    }

    const nouvelleDepense = {
      ...form,
      id: Date.now(),
      montant: parseFloat(form.montant).toFixed(2)
    };

    setDepenses(prev => [nouvelleDepense, ...prev]);
    setForm({ ...form, description: '', montant: '', tag: '' });
    toast.success("Dépense ajoutée avec succès !");
  };

  const supprimerDepense = (id) => {
    setDepenses(prev => prev.filter(depense => depense.id !== id));
    toast.success("Dépense supprimée avec succès !");
  };

  return (
    <>
      <div className="container">
        <h1 className="page-title">📋 Gestion des Dépenses</h1>
        
        <section className="form-section">
          <h2 className="section-title">➕ Ajouter une dépense</h2>
          
          <form 
            onSubmit={e => { e.preventDefault(); ajouterDepense(); }} 
            className="form-grid"
          >
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                value={form.date}
                onChange={e => setForm({...form, date: e.target.value})}
                className="input"
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                placeholder="Repas, transport..."
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                className="input"
              />
            </div>
            
            <div className="form-group">
              <label>Montant (€)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.montant}
                onChange={e => setForm({...form, montant: e.target.value})}
                className="input"
              />
            </div>
            
            <div className="form-group">
              <label>Catégorie</label>
              <input
                type="text"
                placeholder="Alimentation, loisirs..."
                value={form.tag}
                onChange={e => setForm({...form, tag: e.target.value})}
                className="input"
              />
            </div>

            <div className="form-group full-width">
              <button type="submit" className="btn-primary">Enregistrer la dépense</button>
            </div>
          </form>
        </section>

        <section className="history-section">
          <h2 className="section-title">📜 Historique des dépenses</h2>
          
          <div className="table-wrapper">
            <table className="depenses-table">
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
                {depenses.length > 0 ? (
                  depenses.map(depense => (
                    <tr key={depense.id} className="depense-row">
                      <td>{depense.date}</td>
                      <td>{depense.description}</td>
                      <td className="amount">-{depense.montant} €</td>
                      <td>
                        <span className="tag">{depense.tag}</span>
                      </td>
                      <td>
                        <button 
                          onClick={() => supprimerDepense(depense.id)}
                          className="btn-delete"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="empty-state">
                      Aucune dépense enregistrée pour le moment
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        html, body, #root {
          height: 100%;
          width: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
        }
        
        .page-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: #2563eb;
          margin-bottom: 3rem;
          text-align: center;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }
        
        .section-title {
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: #1e40af;
          text-align: center;
        }
        
        .form-section, .history-section {
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.1);
          padding: 2.5rem;
          width: 100%;
          max-width: 1200px;
          margin-bottom: 3rem;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        @media(min-width: 768px) {
          .form-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          
          .form-group.full-width {
            grid-column: span 4;
            display: flex;
            justify-content: flex-end;
          }
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        label {
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #334155;
          font-size: 1.125rem;
        }
        
        .input {
          padding: 1rem 1.25rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 1.125rem;
          transition: all 0.3s ease;
          outline: none;
        }
        
        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
        }
        
        .btn-primary {
          background-color: #2563eb;
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 0.75rem;
          font-size: 1.25rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          max-width: 280px;
        }
        
        .btn-primary:hover {
          background-color: #1e40af;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        
        .btn-delete {
          background-color: #dc2626;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-delete:hover {
          background-color: #b91c1c;
          transform: translateY(-1px);
        }
        
        .table-wrapper {
          overflow-x: auto;
          border-radius: 1rem;
          margin-top: 1.5rem;
        }
        
        table.depenses-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 0.75rem;
          font-size: 1.125rem;
          min-width: 800px;
        }
        
        thead tr th {
          text-align: left;
          padding: 1.25rem 1.5rem;
          background-color: #e0e7ff;
          color: #1e40af;
          font-weight: 700;
          font-size: 1.25rem;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }
        
        tbody tr.depense-row {
          background-color: white;
          transition: all 0.3s ease;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        tbody tr.depense-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        
        tbody tr.depense-row td {
          padding: 1.25rem 1.5rem;
          vertical-align: middle;
        }
        
        tbody tr.depense-row td:first-child {
          border-top-left-radius: 0.75rem;
          border-bottom-left-radius: 0.75rem;
        }
        
        tbody tr.depense-row td:last-child {
          border-top-right-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
        }
        
        .amount {
          color: #dc2626;
          font-weight: 700;
          font-size: 1.25rem;
        }
        
        .tag {
          background-color: #bfdbfe;
          color: #1e40af;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 1rem;
          font-weight: 700;
          display: inline-block;
        }
        
        .empty-state {
          padding: 3rem 2rem;
          text-align: center;
          color: #64748b;
          font-size: 1.25rem;
          font-style: italic;
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 2rem 1rem;
          }
          
          .page-title {
            font-size: 2.5rem;
            margin-bottom: 2rem;
          }
          
          .section-title {
            font-size: 1.75rem;
          }
          
          .form-section, .history-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}