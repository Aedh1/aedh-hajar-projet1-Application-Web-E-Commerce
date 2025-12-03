import React from 'react';

export default function AboutPage() {
  return (
    <div className="container page-fade">
      <div className="about-page">
        <h1>About Amazon Gaming</h1>

        <section className="about-section">
          <h2>À propos</h2>
          <p>
            Amazon Gaming est une application e-commerce de démonstration conçue pour illustrer les
            meilleures pratiques du développement web moderne. Elle combine un backend robuste avec une
            interface utilisateur réactive et intuitive.
          </p>
        </section>

        <section className="about-section">
          <h2>Développement avec GitHub Copilot</h2>
          <p>
            Cette application a été développée avec l'assistance de GitHub Copilot, un assistant de
            programmation basé sur l'IA. Copilot a contribué à l'implémentation du code pour les deux
            composants principaux de l'application :
          </p>
          <ul>
            <li><strong>Backend :</strong> Conception et implémentation des API REST et de la logique métier</li>
            <li><strong>Frontend :</strong> Création des composants React et gestion de l'état avec contexte</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Stack Technologique</h2>
          <div className="tech-grid">
            <div className="tech-card">
              <h3>Backend</h3>
              <ul>
                <li><strong>Node.js</strong> - Runtime JavaScript côté serveur</li>
                <li><strong>Express.js</strong> - Framework web minimaliste et flexible</li>
                <li><strong>REST API</strong> - Architecture client-serveur standard</li>
              </ul>
            </div>

            <div className="tech-card">
              <h3>Frontend</h3>
              <ul>
                <li><strong>React</strong> - Bibliothèque JavaScript pour les interfaces utilisateur</li>
                <li><strong>Vite</strong> - Build tool et dev server rapide</li>
                <li><strong>React Router</strong> - Navigation côté client</li>
                <li><strong>Context API</strong> - Gestion centralisée de l'état (panier)</li>
              </ul>
            </div>

            <div className="tech-card">
              <h3>Outils & Infrastructure</h3>
              <ul>
                <li><strong>Git</strong> - Contrôle de version</li>
                <li><strong>npm</strong> - Gestionnaire de dépendances</li>
                <li><strong>ES6+</strong> - Standard JavaScript moderne</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Fonctionnalités</h2>
          <ul>
            <li>✓ Catalogue de produits avec recherche et filtrage</li>
            <li>✓ Panier persistant synchronisé avec le backend</li>
            <li>✓ Gestion complète du panier (ajouter, modifier quantité, supprimer)</li>
            <li>✓ Design responsive (mobile, tablet, desktop)</li>
            <li>✓ Interface utilisateur moderne et intuitive</li>
            <li>✓ API REST bien structurée et documentée</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Contact & Crédits</h2>
          <p>
            Cette application a été créée comme projet de démonstration. Pour plus d'informations ou
            des questions, n'hésitez pas à consulter la documentation du projet ou les sources sur GitHub.
          </p>
        </section>
      </div>
    </div>
  );
}
