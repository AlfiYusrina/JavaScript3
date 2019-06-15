'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} container The container element in which to render the repository.
   */
  render(container) {
    // TODO: replace the next line with your code.
    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');
    table.appendChild(tableBody);
    container.appendChild(table);

    const makeRow = (label, content) => {
      const tableRow = document.createElement('tr');
      tableBody.appendChild(tableRow);
      const tableData = document.createElement('td');
      const repoName = document.createElement('td');
      tableRow.appendChild(tableData);
      tableRow.appendChild(repoName);
      tableData.innerHTML = label;
      tableData.className = 'label';
      repoName.innerHTML = content;
    };

    const createRepoInfo = () => {
      makeRow(
        'Repository: ',
        `<a href="https://github.com/HackYourFuture/${this.repository.name}" target="_blank">${
          this.repository.name
        }</a>`,
      );
      makeRow('Description: ', this.repository.description);
      makeRow('Forks: ', this.repository.forks);
      makeRow('Updated: ', new Date(this.repository.updated_at).toLocaleDateString('en-US'));
    };
    createRepoInfo();
    // Util.createAndAppend('pre', container, JSON.stringify(this.repository, null, 2));
  }

  /**
   * Returns an array of contributors as a promise
   */
  fetchContributors() {
    return Util.fetchJSON(this.repository.contributors_url);
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.repository.name;
  }
}
