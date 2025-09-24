import React, { useState } from "react";
import './Projects.scss'

const Projects = () => {
  // Données statiques pour tester le tableau
  const [projects] = useState([
    { id: 1, name: "LAUREAT", description: "Etude des prix" },
    { id: 2, name: "PEGASE", description: "Contrôle budgétaire" },
    { id: 3, name: "MATIS", description: "Gestion matériel" },
  ]);

  const handleSelect = (project) => {
    alert(`Projet choisi : ${project.name}`);
    // TODO : plus tard -> sauvegarder dans UserContext ou rediriger
  };

  return (
    <div className="container mt-4 projects-container">
      <h3 className="mb-3">Liste des projets</h3>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map((p, idx) => (
              <tr key={p.id}>
                <td>{idx + 1}</td>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleSelect(p)}
                  >
                    Start
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">Aucun projet disponible</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Projects;