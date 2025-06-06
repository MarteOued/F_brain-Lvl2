// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import apiService from '../services/api';
import './Home.css';

// Composant FeatureCard amélioré
function FeatureCard({ title, description, link, emoji }) {
  return (
    <Link to={link} className="feature-card">
      <div className="feature-card-inner">
        <div className="emoji-circle">{emoji}</div>
        <div className="feature-content">
          <h3 className="feature-title">{title}</h3>
          <p className="feature-desc">{description}</p>
          <span className="feature-link">Commencer →</span>
        </div>
      </div>
    </Link>
  );
}

// Composant StatsCard pour les indicateurs
function StatsCard({ value, label, icon }) {
  return (
    <div className="stats-card">
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState('🔄 Connexion en cours...');
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await testApiConnection();
      await loadInitialData();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const testApiConnection = async () => {
    try {
      const isConnected = await apiService.testConnection();
      setConnectionStatus(isConnected ? '✅ Connecté au serveur' : '❌ Problème de connexion');
    } catch (error) {
      setConnectionStatus('❌ Erreur de connexion');
      console.error('Erreur test connexion:', error);
    }
  };

  const loadInitialData = async () => {
    try {
      const [depensesRes, tagsRes] = await Promise.allSettled([
        apiService.getDepenses(),
        apiService.getTags()
      ]);

      setApiData({
        depenses: depensesRes.status === 'fulfilled' ? depensesRes.value.data : [],
        tags: tagsRes.status === 'fulfilled' ? tagsRes.value.data : [],
        totalDepenses: depensesRes.status === 'fulfilled' ? depensesRes.value.data.length : 0,
        totalTags: tagsRes.status === 'fulfilled' ? tagsRes.value.data.length : 0
      });
    } catch (error) {
      console.error('Erreur chargement données:', error);
      setApiData({ error: 'Impossible de charger les données' });
    }
  };

  return (
    <div className="app-container">
      {/* Barre de navigation premium */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-logo">💰</span>
          <span className="brand-name">BudgetZen</span>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-link active">Accueil</Link>
          <Link to="/depenses" className="nav-link">Dépenses</Link>
          <Link to="/tags" className="nav-link">Catégories</Link>
          <Link to="/analytics" className="nav-link">Analytiques</Link>
          <Link to="/settings" className="nav-link">Paramètres</Link>
        </div>
        <div className="nav-actions">
          <button className="btn-primary">Connexion</button>
        </div>
      </nav>

      <main className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Maîtrisez vos <span className="highlight">finances</span> avec élégance
            </h1>
            <p className="hero-subtitle">
              BudgetZen transforme la gestion d'argent en une expérience zen.
              Visualisez, planifiez et optimisez vos dépenses avec nos outils intelligents.
            </p>
            <div className="hero-actions">
              <Link to="/depenses" className="btn-primary">Nouvelle dépense</Link>
              <Link to="/analytics" className="btn-secondary">Voir les statistiques</Link>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="chart-animation"></div>
          </div>
        </section>

        {/* Status de l'application */}
        <div className={`app-status ${connectionStatus.includes('✅') ? 'success' : 'error'}`}>
          <span>{connectionStatus}</span>
          <button 
            onClick={testApiConnection}
            className="status-refresh"
            disabled={isLoading}
          >
            {isLoading ? '...' : 'Actualiser'}
          </button>
        </div>

        {/* Statistiques rapides */}
        {apiData && !apiData.error && (
          <section className="stats-section">
            <h2 className="section-title">Votre activité récente</h2>
            <div className="stats-grid">
              <StatsCard 
                value={apiData.totalDepenses} 
                label="Dépenses ce mois" 
                icon="💸" 
              />
              <StatsCard 
                value={apiData.totalTags} 
                label="Catégories actives" 
                icon="🏷️" 
              />
              <StatsCard 
                value="€0" 
                label="Budget restant" 
                icon="💰" 
              />
              <StatsCard 
                value="0%" 
                label="Économies" 
                icon="📈" 
              />
            </div>
          </section>
        )}

        {/* Fonctionnalités principales */}
        <section className="features-section">
          <h2 className="section-title">Explorez BudgetZen</h2>
          <div className="features-grid">
            <FeatureCard 
              title="Gestion des dépenses"
              description="Enregistrez et suivez toutes vos transactions financières avec précision"
              link="/depenses"
              emoji="💳"
            />
            <FeatureCard 
              title="Organisation par tags"
              description="Créez et personnalisez vos catégories pour un suivi détaillé"
              link="/tags"
              emoji="🏷️"
            />
            <FeatureCard 
              title="Analyses avancées"
              description="Visualisations claires et rapports personnalisés de vos finances"
              link="/analytics"
              emoji="📊"
            />
            <FeatureCard 
              title="Budgets intelligents"
              description="Définissez des limites et recevez des alertes intelligentes"
              link="/budgets"
              emoji="🎯"
            />
            <FeatureCard 
              title="Objectifs financiers"
              description="Planifiez et atteignez vos objectifs d'épargne"
              link="/goals"
              emoji="🚀"
            />
            <FeatureCard 
              title="Rapports PDF"
              description="Générez et exportez vos rapports financiers"
              link="/reports"
              emoji="📄"
            />
          </div>
        </section>

        {/* Section CTA */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Prêt à prendre le contrôle de vos finances ?</h2>
            <p>Commencez dès aujourd'hui et découvrez comment BudgetZen peut transformer votre relation avec l'argent.</p>
            <Link to="/register" className="btn-primary">Créer un compte gratuit</Link>
          </div>
        </section>
      </main>

      {/* Pied de page professionnel */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-logo">💰</span>
            <span className="brand-name">BudgetZen</span>
            <p>La gestion financière, simplifiée.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Produit</h4>
              <Link to="/features">Fonctionnalités</Link>
              <Link to="/pricing">Tarifs</Link>
              <Link to="/updates">Nouveautés</Link>
            </div>
            <div className="link-group">
              <h4>Ressources</h4>
              <Link to="/blog">Blog</Link>
              <Link to="/help">Aide</Link>
              <Link to="/tutorials">Tutoriels</Link>
            </div>
            <div className="link-group">
              <h4>Entreprise</h4>
              <Link to="/about">À propos</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/careers">Carrières</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2023 BudgetZen. Tous droits réservés.</p>
          <div className="legal-links">
            <Link to="/privacy">Confidentialité</Link>
            <Link to="/terms">Conditions</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}