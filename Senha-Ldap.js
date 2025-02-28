import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getDatabase, ref, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBbiG8N7mdznEZxpE9p0zlWasNT6bGDB3E",
    authDomain: "oms-a-c9762.firebaseapp.com",
    databaseURL: "https://oms-a-c9762-default-rtdb.firebaseio.com",
    projectId: "oms-a-c9762",
    storageBucket: "oms-a-c9762.firebasestorage.app",
    messagingSenderId: "571808116138",
    appId: "1:571808116138:web:3064f5406322204299cfd3",
    measurementId: "G-Q98PRFJMYN"
};

// Inicializando Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Função para converter a data para o formato que o JavaScript entende
function converterParaDataValida(dataStr) {
    // A data recebida do Firebase está no formato dd/mm/yyyy hh:mm:ss
    const partes = dataStr.split(" ");
    const [dia, mes, ano] = partes[0].split("/");  // Separando dd/mm/yyyy
    const [hora, minuto, segundo] = partes[1].split(":");  // Separando hora:minuto:segundo

    // Convertendo para o formato ISO (yyyy-mm-ddThh:mm:ss)
    const dataFormatada = `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;

    return new Date(dataFormatada); // Retorna um objeto Date válido
}

// Função para consultar chamados vinculados ao nome do gestor
function consultarChamadosPorGestor(gestor, dataFiltro) {
    const dbRef = ref(db, 'Solicitacoes');
    const q = query(dbRef, orderByChild('gestor'), equalTo(gestor));

    get(q).then((snapshot) => {
        const resultadosDiv = document.getElementById('resultados');
        resultadosDiv.innerHTML = '';  // Limpa os resultados anteriores
    
        if (snapshot.exists()) {
            const dados = snapshot.val();
            const chamados = Object.values(dados);
    
            // Filtra os chamados pela data
            const chamadosFiltrados = chamados.filter(chamado => {
                const dataChamado = converterParaDataValida(chamado.dataSolicitacao);
                
                // Verifica se a data é válida
                if (isNaN(dataChamado)) {
                    console.error("Data inválida:", chamado.dataSolicitacao);
                    return false; // Ignora este chamado se a data for inválida
                }
                
                // Se dataFiltro estiver disponível, compara a data
                return dataFiltro ? dataChamado.toISOString().split('T')[0] === dataFiltro : true;
            });
    
            // Exibe os chamados
            chamadosFiltrados.forEach(chamado => {
                let status = chamado.status || "Aguardando retorno";
                let comentario = chamado.comentario || "Aguardando retorno";
                let nome = chamado.nome || "Nome não informado";
                let dataSolicitacao = converterParaDataValida(chamado.dataSolicitacao);

                // Verificação adicional de data válida
                if (isNaN(dataSolicitacao)) {
                    console.error("Data inválida:", chamado.dataSolicitacao);
                    return; // Pula este chamado se a data for inválida
                }

                const dataFormatada = `${dataSolicitacao.getDate().toString().padStart(2, '0')}/${(dataSolicitacao.getMonth() + 1).toString().padStart(2, '0')}/${dataSolicitacao.getFullYear()}`;
            
                const chamadoDiv = document.createElement('div');
                chamadoDiv.classList.add('chamado');
                chamadoDiv.style.marginBottom = '5px';
                chamadoDiv.innerHTML = `
                    <p><strong>Nome do Colaborador:</strong> ${nome}</p>
                    <p><strong>Status:</strong> ${status}</p>
                    <p><strong>Data da Solicitação:</strong> ${dataFormatada}</p>
                    <p><strong>Comentário:</strong> ${comentario}</p>
                `;
                resultadosDiv.appendChild(chamadoDiv);
            });
        } else {
            resultadosDiv.innerHTML = '<p>Nenhum chamado encontrado para este gestor.</p>';
        }
    }).catch((error) => {
        console.error("Erro ao consultar chamados:", error);
        const resultadosDiv = document.getElementById('resultados');
        resultadosDiv.innerHTML = `<p>Erro ao carregar os chamados: ${error.message}</p>`;
    });
}


// Recupera o nome do usuário logado do sessionStorage
var loggedInUser = sessionStorage.getItem("loggedInUser");

// Verifica se o usuário está logado
if (loggedInUser) {
    // Exibe o nome do usuário na tela, por exemplo:
    document.getElementById("welcomeMessage").textContent = "Bem-vindo, " + loggedInUser + "!";
    // Preenche o campo de nome do gestor com o nome do usuário logado
    document.getElementById("gestor-name").value = loggedInUser;
} else {
    // Se não houver usuário logado, redireciona para a página de login
    window.location.href = "index.html.html";
}

// Evento de clique no botão de busca
document.getElementById('search-date-button').addEventListener('click', () => {
    const gestorName = document.getElementById('gestor-name').value.trim(); // Nome do gestor
    const dataFiltro = document.getElementById('date-filter').value; // Data selecionada

    if (gestorName) {
        consultarChamadosPorGestor(gestorName, dataFiltro); // Passa o nome do gestor e a data para a consulta
    } else {
        alert('Por favor, insira o nome do gestor para buscar.');
    }
});


        // Função de alternância do menu hambúrguer
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
