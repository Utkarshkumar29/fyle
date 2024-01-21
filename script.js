let currentPage = 1;
let perPage = 10;
let totalPages = 1;

function fetchRepositories() {
    const username = document.getElementById('username').value.trim();
    if (username === '') {
        alert('Please enter a valid GitHub username.');
        return;
    }

    showLoader();

    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}`;

    fetch(apiUrl)
        .then(response => {
            const linkHeader = response.headers.get('Link');
            totalPages = linkHeader ? extractTotalPages(linkHeader) : 1;
            return response.json();
        })
        .then(data => {
            hideLoader();
            displayRepositories(data);
            updatePaginationInfo();
        })
        .catch(error => {
            hideLoader();
            alert('Error fetching repositories. Please try again.');
            console.error(error);
        });
}

function extractTotalPages(linkHeader) {
    const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
    return match ? parseInt(match[1]) : 1;
}

function displayRepositories(repositories) {
    const repositoriesContainer = document.getElementById('repositories');
    repositoriesContainer.innerHTML = '';
    const user=document.getElementById('user')
    user.innerHTML = `<div class="repo">
                        <div>
                            <img class='image' src=${repositories[0].owner.avatar_url} alt="Error"></img>
                            <p>${repositories[0].owner.html_url}</p>
                        </div>
                        <div>
                            <p>${repositories[0].owner.login}</p>
                            <p>Repository Count: ${repositories.length}</p> 
                            <p>Type: ${repositories[0].owner.bio || 'No Bio available'}</p>
                            <p>Type: ${repositories[0].owner.twitter_username || 'No Bio available'}</p>
                        </div>
                 </div>`

    repositories.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.classList.add('repository');
        repoElement.innerHTML = `
                                <h3>${repo.name}</h3>
                                <p>${repo.description || 'No description available.'}</p>
                                <span>${repo.language || 'Not specified'}</span>
                                `;
        repositoriesContainer.appendChild(repoElement);
    });
}

function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

function changePage(offset) {
    currentPage += offset;
    fetchRepositories();
}

function updatePaginationInfo() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = '< Prev';
    prevButton.onclick = () => changePage(-1);
    prevButton.disabled = currentPage === 1;
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => changePage(i - currentPage);
        pageButton.disabled = i === currentPage;
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next >';
    nextButton.onclick = () => changePage(1);
    nextButton.disabled = currentPage === totalPages;
    paginationContainer.appendChild(nextButton);
}

function setPerPage(value) {
    perPage = value;
    currentPage = 1;
    fetchRepositories();
}

function handleSearch() {
    currentPage = 1;
    fetchRepositories();
}
