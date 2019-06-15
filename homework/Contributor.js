'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(contributor) {
    this.contributor = contributor;
  }

  /**
   * Render the contributor info to the DOM.
   * @param {HTMLElement} container The container element in which to render the contributor.
   */
  render(container) {
    // TODO: replace the next line with your code.

    const li = Util.createAndAppend('li', container, {
      class: 'contributor-item',
      'aria-label': this.contributor.login,
    });
    li.innerHTML = `<img src="${
      this.contributor.avatar_url
    }" height="48" class="contributor-avatar">
                <div class="contributor-data">
                  <a href="https://github.com/${this.contributor.login}" target="_blank">${
      this.contributor.login
    }</a>
                  <span class=>${this.contributor.contributions}</span>
                </div>`;

    // Util.createAndAppend('pre', container, JSON.stringify(this.contributor, null, 2));
  }
}
