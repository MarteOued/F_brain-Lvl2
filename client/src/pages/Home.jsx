import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="app-container">
      {/* Barre de navigation */}
      <nav className="navbar">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/depenses" className="nav-link">Dépenses</Link>
        <Link to="/tags" className="nav-link">Tags</Link>
        <Link to="/analytics" className="nav-link">Analytics</Link>
      </nav>

      <main className="container">
        <h1 className="title">
          Bienvenue sur <span className="highlight">BudgetZen</span>
        </h1>
        
        <p className="subtitle">
          L'application simple et puissante pour gérer vos finances personnelles.<br />
          Suivez vos dépenses, organisez vos catégories et prenez le contrôle de votre budget.
        </p>
        
        <section className="features">
          <FeatureCard 
            title="Gérer les dépenses" 
            description="Enregistrez et suivez toutes vos dépenses quotidiennes"
            link="/depenses"
            emoji="💸"
          />
          <FeatureCard 
            title="Organiser les tags" 
            description="Créez des catégories pour classer vos dépenses"
            link="/tags"
            emoji="🏷️"
          />
          <FeatureCard 
            title="Analyser les dépenses" 
            description="Visualisez vos dépenses avec des graphiques"
            link="/analytics"
            emoji="📊"
          />
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .app-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100vw;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f3f4f6;
          color: #1f2937;
        }

        .navbar {
          display: flex;
          justify-content: center;
          gap: 2rem;
          background-color: #1f2937;
          padding: 1rem;
          width: 100%;
        }

        .nav-link {
          color: #e5e7eb;
          font-weight: 500;
          text-decoration: none;
          font-size: 1rem;
          transition: color 0.2s ease;
        }

        .nav-link:hover {
          color: #60a5fa;
        }

        .container {
          text-align: center;
          padding: 3rem 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .title {
          font-size: 3.5rem;
          font-weight: 900;
          color: #2563eb;
          margin-bottom: 1rem;
        }

        .highlight {
          color: #1e40af;
        }

        .subtitle {
          font-size: 1.25rem;
          color: #4b5563;
          margin-bottom: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .features {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }

        @media (min-width: 700px) {
          .features {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .feature-card {
          background-color: white;
          border-radius: 1.25rem;
          padding: 2.5rem 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.3);
        }

        .emoji {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .feature-desc {
          font-size: 1rem;
          color: #6b7280;
          max-width: 260px;
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ title, description, link, emoji }) {
  return (
    <Link to={link} className="feature-card">
      <div className="emoji" aria-hidden="true">{emoji}</div>
      <h2 className="feature-title">{title}</h2>
      <p className="feature-desc">{description}</p>
    </Link>
  );
}