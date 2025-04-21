import { freeCodeCampProjects } from '../data/freeCodeCamp-projects-data.js';

const grid = document.getElementById('freeCodeCamp-projects');
const loadMoreBtn = document.createElement('button');
loadMoreBtn.id = 'btn-loadmore-2';
loadMoreBtn.className = 'btn-load-projects';
loadMoreBtn.textContent = 'Load More';
grid.insertAdjacentElement('afterend', loadMoreBtn);

let loadedCount = 0;
const BATCH_SIZE = 3;

function createProjectElement(project) {
  const el = document.createElement('div');
  el.className = 'container-projects';
  el.innerHTML = `
    <a href="${project.projectLink}" target="_blank">
      <img src="${project.projectImage}" alt="${project.projectName}">
    </a>
    <h3>${project.projectName}</h3>
    <div class="Technologies">
      ${project.projectTechnologies.join('')}
    </div>
  `;
  return el;
}

function renderProjects() {
  const end = Math.min(loadedCount + BATCH_SIZE, freeCodeCampProjects.length);
  for (let i = loadedCount; i < end; i++) {
    grid.appendChild(createProjectElement(freeCodeCampProjects[i]));
  }
  loadedCount = end;
  if (loadedCount >= freeCodeCampProjects.length) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }
}

loadMoreBtn.addEventListener('click', renderProjects);

document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
});