(function() {
    const searchForm = document.getElementById("search-form");
    const searchKeyword = document.getElementById("search-articles");
    const randomArticles = document.getElementById("random-articles");
    const results = document.getElementById("results");
    const resultsContainer = document.getElementById("results-container");
    let searchText;
    searchKeyword.focus();
    results.classList.add("hidden");

    // Search articles event
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();        
        resultsContainer.innerHTML = '';
        searchText = searchKeyword.value;

        // Error Handling
        function requestError(e, part) {
            console.log(e);
            resultsContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
            results.classList.remove("hidden");
        }
        
        // Render search articles
        function addArticles(data) {
            const title = data[1];
            const desc = data[2];
            const link = data[3];
            let content = '';
            for (let i = 0; i < title.length; i++) {
                content += `<a href=${link[i]} target="_blank">
                    <div id="searchArticles">
                        <h1 id="searchTitle">${title[i]}</h1>
                        <p id="searchDesc">${desc[i]}</p>
                    </div>
                </a>`;
            }

            resultsContainer.insertAdjacentHTML('beforeend', content);
            results.classList.remove("hidden");
        }

        // Fetch search articles
        fetch(`https://en.wikipedia.org/w/api.php?format=json&origin=*&action=opensearch&search=${searchText}`, {
            headers: new Headers( {
                'Api-User-Agent': 'WikiViewer/1.0 (https://timh1203.github.io/wikipedia-viewer/;)'
            })
        })
        .then(response => response.json())
        .then(addArticles)
        .catch(err => requestError(err, 'image'));
    })  

    // Random articles event
    randomArticles.addEventListener('click', function() {
        resultsContainer.innerHTML = '';
        searchKeyword.value = '';
        const url = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&grnlimit=5&prop=extract&prop=info&inprop=url&exintro=&titles="
        
        // Error handling
        function requestError(e, part) {
            console.log(e);
            resultsContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
            results.classList.remove("hidden");
        }
        
        // Render random articles
        function addRandoms(data) {
            const randomPages = data.query.pages;
            const length = Object.keys(randomPages).length;
            let content = '';

            (function() {
                let title, extract, pageid;
                
                for (let index in randomPages) {
                    if (randomPages.hasOwnProperty(index)) {
                        title = randomPages[index].title;
                        extract = randomPages[index].extract;
                        pageid = randomPages[index].pageid;
                    }

                    content += `<a href="https://en.wikipedia.org/?curid=${pageid}" target="_blank">
                        <div id="randomArticles">
                            <h1 id="randomArticle">${title}</h1>
                            <p id="randomExtract">${extract}</p>
                        </div>
                    </a>`;
                }
            })();

            resultsContainer.insertAdjacentHTML('beforeend', content);
            results.classList.remove("hidden");
        }

        // Fetch random articles
        fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&grnlimit=5&prop=extracts&exintro=&titles=&origin=*`, {
            headers: new Headers({
                'Api-User-Agent': 'WikiViewer/1.0 (https://timh1203.github.io/wikipedia-viewer/; )'
            })
        })
        .then(response => response.json())
        .then(addRandoms)
        .catch(err => requestError(err, 'image'));
    })
})();