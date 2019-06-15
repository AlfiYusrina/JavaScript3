'use strict';

/* global Util, Repository, Contributor */

class App {
  constructor(url) {
    this.initialize(url);
  }

  /**
   * Initialization
   * @param {string} url The GitHub URL for obtaining the organization's repositories.
   */
  async initialize(url) {
    // 2. Make an initial XMLHttpRequest using Util.fetchJSON() to populate your <select> element

    const root = document.getElementById('root');
    const header = Util.createAndAppend('header', root, { class: 'header' });
    Util.createAndAppend('p', header, { text: 'Hack Your Future Repositories:' });
    const repoSelector = Util.createAndAppend('select', header, { class: 'repo-selector' });
    const container = Util.createAndAppend('div', root, { id: 'container', class: 'container' });
    repoSelector.addEventListener('change', event => {
      const repoId = parseInt(event.target.value);
      this.setRepo(repoId);
    });

    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));
      // TODO: add your own code here
      repoSelector.innerHTML = this.repos
        .map((repo, i) => `<option value="${i}">${repo.name()}</option>`)
        .join('');
    } catch (error) {
      this.renderError(error);
    }
  }

  setRepo(repoId) {
    this.fetchContributorsAndRender(repoId);
    // removeAllChildren(tableBody);
    // createRepoInfo(repoId);
    // createContributorItems(data[repoId].contributors_url);
  }

  /**
   * Removes all child elements from a container element
   * @param {*} container Container element to clear
   */
  static clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  /**
   * Fetch contributor information for the selected repository and render the
   * repo and its contributors as HTML elements in the DOM.
   * @param {number} index The array index of the repository.
   */
  async fetchContributorsAndRender(index) {
    try {
      const repo = this.repos[index];
      const contributors = await repo.fetchContributors();

      const container = document.getElementById('container');
      App.clearContainer(container);

      const leftDiv = Util.createAndAppend('div', container);
      leftDiv.className = 'left-div';
      leftDiv.className += ' whiteframe';
      const rightDiv = Util.createAndAppend('div', container);
      rightDiv.className = 'right-div';
      rightDiv.className += ' whiteframe';
      Util.createAndAppend('p', rightDiv, { class: 'contributor-header', text: 'Contributors' });
      Util.createAndAppend('ul', rightDiv, { class: 'contributor-list' });
      const contributorList = Util.createAndAppend('ul', rightDiv);

      repo.render(leftDiv);

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorList));
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Render an error to the DOM.
   * @param {Error} error An Error object describing the error.
   */
  renderError(error) {
    Util.createAndAppend('div', root, {
      class: 'alert-error',
      text: `Sorry, there's something wrong.`,
    });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
