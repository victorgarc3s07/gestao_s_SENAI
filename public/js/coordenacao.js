import { getFotoPerfil, getAssinatura, getCursosVigentes, getCursosConcluidos, getNome, logoutUser, monitorarTokenExpiracao } from '../api.js'; // Ajuste o caminho conforme necessário
window.onload = () => {
    monitorarTokenExpiracao(); // Verifica a expiração do token assim que a página carrega
    getFotoPerfil();
    getAssinatura();
};
async function carregarCursosVigentes() {
    //Obtém o Token JWT armazenado no localStorage, que é necessário para autencitação.
    const token = localStorage.getItem('token');
    //Chama a função 'getTransactions' que faz a requisição à API para obter todas as transações.
    const cursos = await getCursosVigentes();
    console.log('Cursos Vigentes:', cursos); //Adiciona um log para verificar os dados carregados.
    //Obtém o corpo da tabela onde as transações serão inseridas.
    const div = document.getElementById('courses');
    div.innerHTML = ''; //Limpa o conteúdo da tabela antes de adicionar as novas transações
    //Verificar se a lista de trasações está vazia.
    if (!cursos[0].nome_curso || cursos[0].nome_curso.length === 0) {
        console.log('Nenhum curso encontrado.') //Loga se não houver transações
        const divInterna = document.createElement('div'); // Cria uma nova div.
        divInterna.classList.add('course');
        divInterna.innerHTML = `<span>Nenhum curso encontrado.</span>`; //Exibir uma mensagem informando que nao há transações
        div.appendChild(divInterna); // Adiciona a linha na tabela.
        //return; //Sai da função, já que nao há transaçoes a serem exibidas.
    }
    // Itera sebre a lista de transações e cria uma linha de tabela para cada transação
    cursos.forEach(curso => {
        const divInterna = document.createElement('div'); // Criar uma nova linha na tabela.
        divInterna.classList.add('course')
        divInterna.innerHTML = `
            <div class="accordion-header">
                <span>${curso.nome_curso}</span><!--Exibe o nome do curso-->
                <span class="arrow">&#9650;</span>
            </div>
        `;
        div.appendChild(divInterna); // Adiciona a linha à tabela
    });
}
async function carregarCursosConcluidos() {
    //Obtém o Token JWT armazenado no localStorage, que é necessário para autencitação.
    const token = localStorage.getItem('token');
    //Chama a função 'getTransactions' que faz a requisição à API para obter todas as transações.
    const cursos = await getCursosConcluidos();
    console.log('Cursos cursos concluidos:', cursos); //Adiciona um log para verificar os dados carregados.
    //Obtém o corpo da tabela onde as transações serão inseridas.
    const div = document.getElementById('all-cursos-concluidos')
    div.innerHTML = ''; //Limpa o conteúdo da tabela antes de adicionar as novas transações
    //Verificar se a lista de trasações está vazia.
    if (!cursos[0].nome_curso || cursos[0].nome_curso.length === 0) {
        console.log('Nenhum curso encontrado.') //Loga se não houver transações
        const divInterna = document.createElement('div'); // Cria uma nova div.
        divInterna.innerHTML = `<span>Nenhum curso encontrado.</span>`; //Exibir uma mensagem informando que nao há transações
        divInterna.classList.add('course-item')
        div.appendChild(divInterna); // Adiciona a linha na tabela.
        return; //Sai da função, já que nao há transaçoes a serem exibidas.
    }
    // Itera sebre a lista de transações e cria uma linha de tabela para cada transação
    cursos.forEach(curso => {
        const divInterna = document.createElement('div'); // Criar uma nova linha na tabela.
        divInterna.classList.add('course-item');
        divInterna.innerHTML = `
        <h2 class="course-title">${curso.nome_curso}</h2>
        <p class="course-date"><b>Concluido em ${curso.data_fim.substring(0, 10)}</b></p>
        `;
        div.appendChild(divInterna); // Adiciona a linha à tabela
    });
}
//Chama a função 'getTransactions' que faz a requisição à API para obter todas as transações.
const nome = await getNome();
//Obtém o corpo da tabela onde as transações serão inseridas.
const saudacoes = document.getElementsByClassName('saudacao');
for (let i = 0; i < saudacoes.length; i++) {
    saudacoes[i].innerText = ''; // Modifica o texto de cada elemento
}
//Verificar se a lista de trasações está vazia.
// if (!nome || nome.length === 0) {
if (!nome || !nome.nome) {
    console.log('Nenhum nome encontrado.') //Loga se não houver transações
    for (let i = 0; i < saudacoes.length; i++) {
        saudacoes[i].innerText = `Favor faça login`; // Modifica o texto de cada elemento
    }; //Exibir uma mensagem informando que nao há transações
}
// função para ajustar nome de usuário
function transformarNome(nome){
    return nome.split(" ")
}
function ajustandoNome(nomes){
    let nomeAjustado = ""

    nomes.forEach(nome => {
        if(nome.length > 3){
            nomeAjustado += `${nome[0].toUpperCase()}${nome.substring(1)} `
        }else{
            nomeAjustado+=nome+" "
        }
    });
    return nomeAjustado.substring(0, nomeAjustado.length - 1)
}

// Itera sebre a lista de transações e cria uma linha de tabela para cada transação
const saudacao1 = document.getElementsByClassName('saudacao')[0];
saudacao1.innerText = `${ajustandoNome(transformarNome(nome.nome))}`; // Limpa o conteúdo de um unico elemento (se fosse id)
const saudacao2 = document.getElementsByClassName('saudacao')[1];
saudacao2.innerText = `Olá, ${ajustandoNome(transformarNome(nome.nome))}`; // Limpa o conteúdo de um unico elemento (se fosse id)
//LOGOUT
document.querySelector('#btnLogout').addEventListener('click', async (event) => {
    try {
        await logoutUser(); // Chama a função de logout
        alert('Logout feito com sucesso!')
    } catch (error) {
        console.error('Erro no logout:', error);
        alert('Houve um erro ao tentar deslogar. Tente novamente.');
    }
});
//FOTO PERFIL
document.addEventListener('DOMContentLoaded', () => {
    // Função assíncrona para preview de imagem
    async function previewImageAsync(input, previewContainer, width, height) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewContainer.innerHTML = `<img src="${e.target.result}" width="${width}" height="${height}" />`;
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    // Seletores dos elementos
    const newProfileImage = document.getElementById('newProfileImage');
    const saveProfileImage = document.getElementById('saveProfileImage');
    const profilePreview = document.querySelector('.fot');
    // Função assíncrona para alterar a imagem de perfil
    // Armazena temporariamente o arquivo selecionado
    let selectedProfileImage = null;
    newProfileImage.addEventListener('change', async () => {
        // Exibe a pré-visualização da imagem
        await previewImageAsync(newProfileImage, profilePreview, 50, 50);
        selectedProfileImage = newProfileImage.files[0]; // Armazena o arquivo selecionado
    });
    saveProfileImage.addEventListener('click', async () => {
        console.log('Botão de salvar imagem clicado');
        if (selectedProfileImage) {
            try {
                // Adicionar feedback visual
                saveProfileImage.disabled = true;
                saveProfileImage.textContent = 'Salvando...';
                const response = await uploadProfileImage(selectedProfileImage);
                console.log('Resposta completa:', response); // Debug
                if (response && response.path) {
                    // Atualizar todas as imagens de perfil na página
                    const profileImages = document.querySelectorAll('.profile-image');
                    profileImages.forEach(img => {
                        img.src = response.path;
                    });
                    // Atualizar também a prévia no modal
                    const previewImage = document.querySelector('.fot img');
                    if (previewImage) {
                        previewImage.src = response.path;
                    }
                    alert('Imagem de perfil atualizada com sucesso!');
                } else {
                    throw new Error('Caminho da imagem não encontrado na resposta');
                }
            } catch (error) {
                console.error('Erro detalhado:', error);
                alert('Erro ao salvar imagem de perfil: ' + error.message);
            } finally {
                // Restaurar o botão
                saveProfileImage.disabled = false;
                saveProfileImage.textContent = 'Salvar Imagem de Perfil';
            }
        } else {
            alert('Nenhuma imagem foi selecionada.');
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Configuração do canvas de assinatura
    const signatureCanvas = new fabric.Canvas('signatureCanvas', {
        width: 500,
        height: 200,
        isDrawingMode: true
    });
    // Personalizar brush da assinatura
    signatureCanvas.freeDrawingBrush.width = 3;
    signatureCanvas.freeDrawingBrush.color = 'black';
    // Função para limpar o canvas de assinatura
    function limparAssinatura() {
        signatureCanvas.clear();
    }
    const limpar = document.getElementById('limpar');
    limpar.addEventListener('click', () => {
        limparAssinatura();
    })
    const saveSignatureImage = document.getElementById('saveSignatureImage');
   // const signatureContainer = document.getElementById('signatureContainer'); // Container do canvas e da prévia da assinatura
    // Função assíncrona para salvar a assinatura
    saveSignatureImage.addEventListener('click', async () => {
        try {
            // Captura a assinatura em formato Blob
            signatureCanvas.getElement().toBlob(async (blob) => {
                if (!blob) {
                    alert('Erro ao capturar a assinatura.');
                    return;
                }
                // Adicionar feedback visual
                saveSignatureImage.disabled = true;
                saveSignatureImage.textContent = 'Salvo';
                const response = await uploadSignature(blob);
                console.log('Resposta completa:', response); // Debug
                if (response?.path) {
                    alert('Assinatura salva com sucesso!');
                    //limparAssinatura(); // Limpa o canvas após salvar
                    signatureCanvas.isDrawingMode = false; // Desabilita o modo de desenho
                    location.reload();
                } else {
                    throw new Error('Erro ao salvar assinatura: Caminho da assinatura não retornado.');
                }
            }, 'image/png'); // Converte o canvas para PNG
        } catch (error) {
            console.error('Erro ao salvar assinatura:', error);
            alert(error.message || 'Erro ao salvar assinatura.');
            saveSignatureImage.disabled = false; // Reativa o botão apenas em caso de erro
            saveSignatureImage.textContent = 'Salvar Assinatura';
        }
    });
});
//Adiciona um evento que executa a função 'carregarTransacoes' quando o documento estiver totalmete carregado.
document.addEventListener('DOMContentLoaded', () => {
    carregarCursosVigentes(),
        carregarCursosConcluidos(),
        carregarNome()
});