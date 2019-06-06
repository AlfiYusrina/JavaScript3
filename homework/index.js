'use strict';

{
  const fetchJSON = (url, cb) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(
          new Error(
            `Sorry, there's something wrong. Network error : ${xhr.status} - ${xhr.statusText}.`,
          ),
        );
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  };

  const createAndAppend = (name, parent, options = {}) => {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  };

  const main = url => {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, {text: err.message, class: 'alert-error'});
      } else {
        const rootContainer = document.getElementById('root');
        const header = document.createElement('header');
        header.className = 'header';
        const titleHeader = document.createElement('p');
        titleHeader.innerHTML = 'HYF Repositories: ';
        const repoSelector = document.createElement('select');
        repoSelector.className = 'repo-selector';
        header.appendChild(titleHeader);
        header.appendChild(repoSelector);

        const container = document.createElement('div');
        container.className = 'container';

        const containerLeft = document.createElement('div');
        containerLeft.className = 'left-div';
        containerLeft.className += ' whiteframe';

        const containerRight = document.createElement('div');
        containerRight.className = 'right-div';
        containerRight.className += ' whiteframe';

        const table = document.createElement('table');
        const tableBody = document.createElement('tbody');
        table.appendChild(tableBody);
        containerLeft.appendChild(table);
        const removeAllChildren = parent => {
          while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
          }
        };
        const contributorHeader = document.createElement('p');
        contributorHeader.className = 'contributor-header';
        contributorHeader.innerHTML = 'Contributors';
        const contributorList = document.createElement('ul');
        contributorList.className = 'contributor-list';
        containerRight.appendChild(contributorHeader);
        containerRight.appendChild(contributorList);

        container.appendChild(containerLeft);
        container.appendChild(containerRight);
        rootContainer.appendChild(header);
        rootContainer.appendChild(container);

        const repos = document.querySelector('.repo-selector');
        data.sort((a, b) => a.name.localeCompare(b.name));

        repos.innerHTML = data
          .map((repo, i) => `<option value="${i}">${repo.name}</option>`)
          .join('');

        const tableRow = document.createElement('tr');
        tableBody.appendChild(tableRow);

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
        const createContributorItems = url => {
          fetch(url)
            .then(response => response.json())
            .then(data => {
              contributorList.innerHTML = data
                .map(
                  (item, i) =>
                    `<li class="contributor-item" aria-label=${item.login} tabindex="${i}">
                  <img src="${item.avatar_url}" height="48" class="contributor-avatar">
                  <div class="contributor-data">
                    <a href="https://github.com/${item.login}" target="_blank">${item.login}</a>
                    <span class=>${item.contributions}</span>
                  </div>
                </li>`,
                )
                .join('');
            });
        };
        const createRepoInfo = repoId => {
          makeRow(
            'Repository: ',
            `<a href="https://github.com/HackYourFuture/${data[repoId].name}" target="_blank">${
              data[repoId].name
            }</a>`,
          );
          makeRow('Description: ', data[repoId].description);
          makeRow('Forks: ', data[repoId].forks);
          makeRow('Updated: ', new Date(data[repoId].updated_at).toLocaleDateString('en-US'));
        };
        const setRepo = repoId => {
          removeAllChildren(tableBody);
          createRepoInfo(repoId);
          createContributorItems(data[repoId].contributors_url);
        };
        setRepo(0);
        repos.addEventListener('change', function() {
          const repoId = this.value;
          setRepo(repoId);
        });
      }
    });
  };

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
