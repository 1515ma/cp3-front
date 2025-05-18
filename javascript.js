function buscarPorTipo(tipo) {
    fetch(`https://pokeapi.co/api/v2/type/${tipo}`)
      .then(response => response.json())
      .then(data => {
        const lista = document.getElementById('lista-pokemons');
        lista.innerHTML = ''; 
  
        data.pokemon.forEach(item => {
          const li = document.createElement('li');
          const urlParts = item.pokemon.url.split('/');
          const id = urlParts[urlParts.length - 2];
  
          const img = document.createElement('img');
          img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
          img.style.width = '100px';
          img.style.cursor = 'pointer';
          img.onclick = () => mostrarDetalhes(id);
  
          li.appendChild(img);
          lista.appendChild(li);
        });
      });
  }
  
  function buscarTodos() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(response => response.json())
      .then(data => {
        const lista = document.getElementById('lista-pokemons');
        lista.innerHTML = '';
  
        data.results.forEach(item => {
          const li = document.createElement('li');
  
          const urlParts = item.url.split('/');
          const id = urlParts[urlParts.length - 2];
  
          const img = document.createElement('img');
          img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
          img.alt = item.name;
          img.style.width = '100px';
          img.style.cursor = 'pointer';
  
          img.onclick = () => mostrarDetalhes(id);
  
          li.appendChild(img);
          lista.appendChild(li);
        });
      });
  }
  
  function mostrarDetalhes(id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(response => response.json())
      .then(pokemon => {
        fetch(pokemon.species.url)
          .then(response => response.json())
          .then(species => {
            fetch(species.evolution_chain.url)
              .then(response => response.json())
              .then(evolucao => {
  
                const nameDiv = document.getElementById('name__pokemon');
                const infoPDiv = document.getElementById('info_poke');
                const evoluçãoNameDiv = document.getElementById('evolução__name');
                const evoluçãoImgDiv = document.getElementById('evolução__img');
  
                nameDiv.innerHTML = ''; 
                infoPDiv.innerHTML = '';
                evoluçãoNameDiv.innerHTML = '';
                evoluçãoImgDiv.innerHTML = '';
  
                const titulo = document.createElement('h2');
                titulo.textContent = capitalize(pokemon.name);
                nameDiv.appendChild(titulo);
  
                const altura = document.createElement('p');
                altura.innerHTML = `<strong>Altura:</strong> ${(pokemon.height / 10).toFixed(1)} m`;
                infoPDiv.appendChild(altura);
  
                const peso = document.createElement('p');
                peso.innerHTML = `<strong>Peso:</strong> ${(pokemon.weight / 10).toFixed(1)} kg`;
                infoPDiv.appendChild(peso);
  
                const tipos = document.createElement('p');
                tipos.innerHTML = `<strong>Tipos:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}`;
                infoPDiv.appendChild(tipos);  
        
                criarEvolucoesSeparadas(evolucao.chain, evoluçãoNameDiv, evoluçãoImgDiv);
  
                document.getElementById('modal').style.display = 'block';
              });
          });
      });
  }
  
  function criarEvolucoesSeparadas(chain, nomeContainer, imgContainer) {
    const nome = capitalize(chain.species.name);
  
    const urlParts = chain.species.url.split('/');
    const id = urlParts[urlParts.length - 2];
  
    const nomeSpan = document.createElement('span');
    nomeSpan.textContent = nome + ' ';
    nomeContainer.appendChild(nomeSpan);
  
    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    img.style.width = '50px';
    img.style.verticalAlign = 'middle';
    img.style.marginRight = '10px';
    imgContainer.appendChild(img);
  
    if (chain.evolves_to.length > 0) {
      const setaNome = document.createElement('span');
      setaNome.textContent = ' → ';
      nomeContainer.appendChild(setaNome);
  
      const setaImg = document.createElement('span');
      setaImg.textContent = ' → ';
      imgContainer.appendChild(setaImg);
  
      chain.evolves_to.forEach((evolucao, index) => {
        criarEvolucoesSeparadas(evolucao, nomeContainer, imgContainer);
  
        if (index < chain.evolves_to.length - 1) {
          const virgulaNome = document.createElement('span');
          virgulaNome.textContent = ', ';
          nomeContainer.appendChild(virgulaNome);
  
          const virgulaImg = document.createElement('span');
          virgulaImg.textContent = ', ';
          imgContainer.appendChild(virgulaImg);
        }
      });
    }
  }
  
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  document.getElementById('fechar-modal').onclick = function () {
    document.getElementById('modal').style.display = 'none';
  }
  
  window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) {
      document.getElementById('modal').style.display = 'none';
    }
  }

   const pokemonData = {};

   document.addEventListener('DOMContentLoaded', function() {
     document.getElementById('pokemon-image').src = '/api/placeholder/250/180';
     document.getElementById('pokemon-image').alt = 'Carregando Pokémon...';
     
     fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
       .then(response => response.json())
       .then(data => {
         const selectPokemon = document.getElementById('card-pokemon');
         
         selectPokemon.innerHTML = '<option value="">Selecione o pokemon</option>';
         
         data.results.forEach((pokemon, index) => {
           const pokemonId = index + 1;
           const option = document.createElement('option');
           option.value = pokemonId;
           option.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
           
           pokemonData[pokemonId] = {
             name: pokemon.name,
             url: pokemon.url
           };
           
           selectPokemon.appendChild(option);
         });
         
         document.getElementById('pokemon-image').alt = 'Selecione um Pokémon';
       })
       .catch(error => {
         console.error('Erro ao carregar lista de Pokémon:', error);
         document.getElementById('pokemon-image').alt = 'Erro ao carregar Pokémon';
       });
     
     document.getElementById('card-name').addEventListener('input', updateCardName);
     document.getElementById('card-hp').addEventListener('input', updateCardHP);
     document.getElementById('card-pokemon').addEventListener('change', updatePokemonImage);
     document.getElementById('card-category').addEventListener('change', updateCardCategory);
     document.getElementById('card-attack').addEventListener('input', updateCardAttack);
     document.getElementById('card-resistance').addEventListener('input', updateCardResistance);
     
     document.getElementById('create-card').addEventListener('click', saveCard);
   });
   
   function updateCardName() {
     const name = document.getElementById('card-name').value || 'Nome da Carta';
     document.querySelector('.card-name').textContent = name;
   }
   
   function updateCardHP() {
     const hp = document.getElementById('card-hp').value || '100';
     document.querySelector('.card-hp').textContent = 'HP: ' + hp;
   }
   
   function updatePokemonImage() {
     const pokemonId = document.getElementById('card-pokemon').value;
     
     if (pokemonId) {
       document.getElementById('pokemon-image').src = '/api/placeholder/250/180';
       document.getElementById('pokemon-image').alt = 'Carregando...';
       
       const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
       
       const img = new Image();
       img.onload = function() {
         document.getElementById('pokemon-image').src = imageUrl;
         document.getElementById('pokemon-image').alt = document.getElementById('card-pokemon').options[document.getElementById('card-pokemon').selectedIndex].text;
       };
       img.onerror = function() {
         document.getElementById('pokemon-image').src = '/api/placeholder/250/180';
         document.getElementById('pokemon-image').alt = 'Imagem não disponível';
       };
       img.src = imageUrl;
       
       fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
         .then(response => response.json())
         .then(data => {
         })
         .catch(error => {
           console.error('Erro ao carregar detalhes do Pokémon:', error);
         });
     } else {
       document.getElementById('pokemon-image').src = '/api/placeholder/250/180';
       document.getElementById('pokemon-image').alt = 'Selecione um Pokémon';
     }
   }
   
   function updateCardCategory() {
     const category = document.getElementById('card-category').value || 'Básico';
     document.querySelector('.card-category').textContent = category;
   }
   
   function updateCardAttack() {
     const attack = document.getElementById('card-attack').value || '50';
     document.getElementById('attack-value').textContent = attack;
   }
   
   function updateCardResistance() {
     const resistance = document.getElementById('card-resistance').value || '30';
     document.getElementById('resistance-value').textContent = resistance;
   }
   
   function saveCard() {
     const cardName = document.getElementById('card-name').value;
     const cardPokemon = document.getElementById('card-pokemon').value;
     
     if (!cardName || !cardPokemon) {
       alert('Por favor, preencha pelo menos o nome da carta e selecione um Pokémon.');
       return;
     }
     
     alert('Carta criada com sucesso!');
     
     document.getElementById('card-name').value = '';
     document.getElementById('card-hp').value = '';
     document.getElementById('card-pokemon').value = '';
     document.getElementById('card-category').value = '';
     document.getElementById('card-attack').value = '';
     document.getElementById('card-resistance').value = '';
     
     document.querySelector('.card-name').textContent = 'Nome da Carta';
     document.querySelector('.card-hp').textContent = 'HP: 100';
     document.getElementById('pokemon-image').src = '/api/placeholder/250/180';
     document.getElementById('attack-value').textContent = '50';
     document.getElementById('resistance-value').textContent = '30';
     document.querySelector('.card-category').textContent = 'Básico';
   }
  