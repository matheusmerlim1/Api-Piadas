document.getElementById('jokeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const jokeText = document.getElementById('joke').value;
    const category = document.getElementById('category').value;
    const language = document.getElementById('language').value;

    if (jokeText) {
        // Adiciona a piada localmente
        addJokeToList(jokeText, category, language);

        // Limpar o campo do formulário
        document.getElementById('joke').value = '';
    }
});

function addJokeToList(joke, category, language) {
    const jokeItem = document.createElement('li');
    jokeItem.classList.add('joke-item');

    // Texto da piada
    const jokeText = document.createElement('p');
    jokeText.textContent = `"${joke}"`;
    jokeItem.appendChild(jokeText);

    // Categoria
    const jokeCategory = document.createElement('p');
    jokeCategory.classList.add('joke-category');
    jokeCategory.textContent = `Tema: ${category} (Idioma: ${language === 'pt' ? 'Português' : 'Inglês'})`;
    jokeItem.appendChild(jokeCategory);

    // Classificação
    const ratingSection = document.createElement('div');
    ratingSection.classList.add('joke-rating');

    const ratingInput = document.createElement('input');
    ratingInput.type = 'number';
    ratingInput.min = 1;
    ratingInput.max = 5;
    ratingInput.placeholder = 'Nota (1-5)';
    ratingSection.appendChild(ratingInput);

    const submitRatingButton = document.createElement('button');
    submitRatingButton.textContent = 'Avaliar';
    submitRatingButton.onclick = function() {
        const rating = ratingInput.value;
        if (rating >= 1 && rating <= 5) {
            alert(`Nota para a piada: ${rating}`);
        } else {
            alert('Por favor, insira uma nota válida entre 1 e 5.');
        }
    };
    ratingSection.appendChild(submitRatingButton);

    jokeItem.appendChild(ratingSection);

    // Adiciona a piada à lista
    document.getElementById('piadas').appendChild(jokeItem);
}

// Função para pegar piadas de um tema usando a JokeAPI e idioma
function getJokesByCategory(category, language) {
    const url = `https://v2.jokeapi.dev/joke/${category}?type=single&lang=${language}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao carregar a piada');
            }
            return response.json();
        })
        .then(data => {
            console.log('Piada recebida:', data); 
            if (data.type === "single") {
                addJokeToList(data.joke, category, language);
            } else {
                addJokeToList(`${data.setup} - ${data.delivery}`, category, language);
            }
        })
        .catch(error => console.error('Erro ao buscar piada:', error));
}

// Função de busca de piadas
document.getElementById('searchButton').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchTerm').value;
    const language = document.getElementById('language').value; // Pega o idioma selecionado

    if (searchTerm) {
        // A URL agora inclui tanto o termo de busca quanto o idioma
        fetch(`https://v2.jokeapi.dev/joke/Any?contains=${searchTerm}&lang=${language}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao buscar piadas');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('piadas').innerHTML = ''; // Limpar lista
                console.log('Piadas encontradas:', data); 
                if (data.type === "single") {
                    addJokeToList(data.joke, 'Any', language);
                } else {
                    addJokeToList(`${data.setup} - ${data.delivery}`, 'Any', language);
                }
            })
            .catch(error => console.error('Erro ao buscar piadas:', error));
    }
});

// Exibir piadas ao carregar a página (exemplo de piadas sobre "Programming" e idioma selecionado)
window.onload = function() {
    const language = document.getElementById('language').value;
    getJokesByCategory('Programming', language);
};
