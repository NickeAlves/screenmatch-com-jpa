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
    const listaHTML = dados.slice(0, 5).map((filme) => `
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

function limparElementos() {
    for (const section of sectionsParaOcultar) {
        section.classList.toggle('hidden')
    }
}

const categoriaSelect = document.querySelector('[data-categorias]');
const sectionsParaOcultar = document.querySelectorAll('.section')

categoriaSelect.addEventListener('change', async function handleMudancaCategoria() {
    const categoriaSelecionada = categoriaSelect.value;

    if (categoriaSelecionada === 'todos') {

        limparElementos();
    } else {
        limparElementos();

        try {
            const data = await getDados(`/series/categoria/${categoriaSelecionada}`);
            criarListaFilmes(categoria, data);
        } catch (error) {
            lidarComErro("Ocorreu um erro ao carregar os dados da categoria.");
        }
    }
});
gerarSeries();
async function gerarSeries() {
    const urls = ['/series/top5', '/series/lancamentos', '/series'];

    try {

        const data = await Promise.all(urls.map(url => getDados(url)));
        criarListaFilmes(elementos.top5, data[0]);
        criarListaFilmes(elementos.lancamentos, data[1]);
        criarListaFilmes(elementos.series, data[2]);
    } catch (error) {
        lidarComErro("Ocorreu um erro ao carregar os dados.");
    }
}
