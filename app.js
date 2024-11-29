function redirecionarParaHome(event) {
    event.preventDefault();
    window.location.href = "indexinicio.html";
}

// Função para exibir o modal de agradecimento
function exibirModalAgradecimento() {
    const modal = new bootstrap.Modal(document.getElementById("agradecimentoModal"));
    modal.show();
}

// Função para redirecionar para a página inicial após clicar em OK no modal
function voltarParaHome() {
    window.location.href = "indexinicio.html";
}

// Função para mostrar pré-visualização de imagens ou vídeos
function mostrarPreviewArquivo() {
    const mediaSelector = document.getElementById('mediaSelector');
    const preview = document.getElementById('preview');

    preview.innerHTML = '';  // Limpa o conteúdo anterior

    const file = mediaSelector.files[0];
    if (!file) return;

    const fileURL = URL.createObjectURL(file);
    if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = fileURL;
        img.alt = 'Preview da Imagem';
        img.style.maxHeight = '200px';
        img.classList.add('img-fluid');
        preview.appendChild(img);
    } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = fileURL;
        video.controls = true;
        video.style.maxHeight = '200px';
        preview.appendChild(video);
    } else {
        preview.innerHTML = '<p>Arquivo não suportado.</p>';
    }
}

async function processarCep(e) {
    e.preventDefault(); // Previne o envio padrão do formulário

    const cep = document.getElementById('postcode').value;
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = 'Carregando...'; // Feedback ao usuário

    if (cep.length !== 8) {
        resultsContainer.innerHTML = 'CEP deve ter 8 caracteres.';
        return;
    }

    try {
        // Fazer a requisição para a API
        const response = await fetch(`https://h-apigateway.conectagov.estaleiro.serpro.gov.br/api-cep/v1/consulta/cep/${cep}`, {
            method: 'GET',
            headers: {
                'x-cpf-usuario': 'SEU_CPF_AQUI',
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            resultsContainer.innerHTML = `
                <h2>Resultados:</h2>
                <p><strong>CEP:</strong> ${data.cep}</p>
                <p><strong>Tipo:</strong> ${data.tipoCep}</p>
                <p><strong>Subtipo:</strong> ${data.subTipoCep}</p>
                <p><strong>UF:</strong> ${data.uf}</p>
                <p><strong>Cidade:</strong> ${data.cidade}</p>
                <p><strong>Bairro:</strong> ${data.bairro}</p>
                <p><strong>Endereço:</strong> ${data.endereco}</p>
                <p><strong>Complemento:</strong> ${data.complemento}</p>
                <p><strong>Código IBGE:</strong> ${data.codigoIBGE || 'Não informado'}</p>
            `;
        } else if (response.status === 400) {
            resultsContainer.innerHTML = `<p>CEP inválido. Tente novamente.</p>`;
        } else if (response.status === 404) {
            resultsContainer.innerHTML = `<p>CEP não encontrado.</p>`;
        } else {
            throw new Error('Erro no servidor');
        }
    } catch (error) {
        console.error(error);
        resultsContainer.innerHTML = `<p>Ocorreu um erro: ${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Adicionando eventos para navegação
    const linkHome = document.getElementById("linkHome");
    const logoutButton = document.getElementById("logoutButton");

    linkHome.addEventListener("click", redirecionarParaHome);
    logoutButton.addEventListener("click", redirecionarParaHome);

    // Adicionando eventos para o envio de reclamação
    const enviarButton = document.getElementById("enviarReclamacao");
    const okButton = document.getElementById("okButton");

    enviarButton.addEventListener("click", exibirModalAgradecimento);
    okButton.addEventListener("click", voltarParaHome);

    const mediaSelector = document.getElementById('mediaSelector');
    mediaSelector.addEventListener("change", mostrarPreviewArquivo);

    // Adicionando evento para o formulário de CEP
    const cepForm = document.getElementById('cepForm');
    cepForm.addEventListener('submit', processarCep);
});
