import getDados from "./getDados.js";

const elementos = {
    top5: document.querySelector('[data-name="top5"]'),
    lancamentos: document.querySelector('[data-name="lancamentos"]'),
    series: document.querySelector('[data-name="series"]')
};

function criarListaFilmes(elemento, dados) {
    const ulExistente = elemento.querySelector('ul');

    if (ulExistente) {
        elemento.removeChild(ulExistente);
    }

    const ul = document.createElement('ul');
    ul.className = 'lista';
    const listaHTML = dados.map((filme) => `
        <li>
            <a href="/frontend/detalhes.html?id=${filme.id}">
                <img src="${filme.poster}" alt="${filme.titulo}">
            </a>
        </li>
    `).join('');

    ul.innerHTML = listaHTML;
    elemento.appendChild(ul);
}

function lidarComErro(mensagemErro) {
    console.error(mensagemErro);
}

const categoriaSelect = document.querySelector('[data-categorias]');
const sectionsParaOcultar = document.querySelectorAll('.section');

categoriaSelect.addEventListener('change', function () {
    const categoria = document.querySelector('[data-name="categoria"]');
    const categoriaSelecionada = categoriaSelect.value;

    if (categoriaSelecionada === 'todos') {

        for (const section of sectionsParaOcultar) {
            section.classList.remove('hidden')
        }
        categoria.classList.add('hidden');

    } else {

        for (const section of sectionsParaOcultar) {
            section.classList.add('hidden')
        }

        categoria.classList.remove('hidden')
        getDados(`/series/categoria/${categoriaSelecionada}`)
            .then(data => {
                criarListaFilmes(categoria, data);
            })
            .catch(error => {
                lidarComErro("Ocorreu um erro ao carregar os dados da categoria.");
            });
    }
});

geraSeries();
function geraSeries() {
    const urls = ['/series/top5', '/series/lancamentos', '/series'];

    Promise.all(urls.map(url => getDados(url)))
        .then(data => {
            criarListaFilmes(elementos.top5, data[0]);
            criarListaFilmes(elementos.lancamentos, data[1]);
            criarListaFilmes(elementos.series, data[2].slice(0, 5));
        })
        .catch(error => {
            lidarComErro("Ocorreu um erro ao carregar os dados.");
        });
}
