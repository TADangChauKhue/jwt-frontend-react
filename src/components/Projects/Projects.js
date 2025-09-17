import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import "./Projects.scss";
import { UserContext } from "../../context/UserContext";
import { fetchProjectsByGroup } from "../../services/projectServices";

const Projects = () => {
  const { user } = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const groupId = useMemo(() => user?.account?.groupWithRoles?.id, [user]);

  const loadProjects = useCallback(
    async (pageToLoad = 1) => {
      if (!user?.isAuthenticated) {
        setProjects([]);
        setTotalPages(0);
        setErrorMessage("");
        setIsLoading(false);
        return;
      }

      if (!groupId) {
        setProjects([]);
        setTotalPages(0);
        setErrorMessage("Aucun groupe n'est associé à votre compte.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetchProjectsByGroup(groupId, pageToLoad, pageSize);

        if (response && +response.EC === 0) {
          const data = response.DT || {};
          const projectList = Array.isArray(data.projects)
            ? data.projects
            : Array.isArray(data)
            ? data
            : [];

          setProjects(projectList);
          setTotalPages(data.totalPages ? data.totalPages : 0);

          if (!projectList.length) {
            setErrorMessage("Aucun projet disponible pour votre groupe.");
          }
        } else {
          setProjects([]);
          setTotalPages(0);
          setErrorMessage(response?.EM || "Impossible de récupérer les projets.");
        }
      } catch (error) {
        setProjects([]);
        setTotalPages(0);
        setErrorMessage("Impossible de récupérer les projets.");
      } finally {
        setIsLoading(false);
      }
    },
    [groupId, pageSize, user?.isAuthenticated]
  );

  useEffect(() => {
    if (user?.isAuthenticated) {
      setCurrentPage(1);
      loadProjects(1);
    } else {
      setProjects([]);
      setTotalPages(0);
      setErrorMessage("");
    }
  }, [user?.isAuthenticated, groupId, loadProjects]);

  const handleRefresh = () => {
    loadProjects(currentPage);
  };

  const handlePageClick = (event) => {
    const nextPage = +event.selected + 1;
    setCurrentPage(nextPage);
    loadProjects(nextPage);
  };

  const handleSelectProject = (project) => {
    const projectLabel = project?.name || project?.title || project?.code || `#${project?.id}`;
    toast.info(`Projet "${projectLabel}" sélectionné.`);
  };

  return (
    <div className="container">
      <div className="projects-container">
        <div className="projects-header">
          <div className="title mt-3">
            <h3>Projects</h3>
          </div>
          <div className="actions my-3">
            <button
              className="btn btn-outline-secondary refresh"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <i className="fa fa-refresh"></i>
              Actualiser
            </button>
          </div>
        </div>

        <div className="projects-body">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Id</th>
                <th scope="col">Nom</th>
                <th scope="col">Description</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Chargement des projets...
                  </td>
                </tr>
              ) : projects && projects.length > 0 ? (
                projects.map((project, index) => (
                  <tr key={project?.id || `project-${index}`}>
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td>{project?.id ?? "-"}</td>
                    <td>{project?.name || project?.title || "Sans nom"}</td>
                    <td>{project?.description || "-"}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleSelectProject(project)}
                      >
                        Choisir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 empty-message">
                    {errorMessage || "Aucun projet disponible pour votre groupe."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="projects-footer">
            <ReactPaginate
              nextLabel="suivant >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={totalPages}
              previousLabel="< précédent"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              forcePage={currentPage - 1}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
