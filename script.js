// ==========================================================
// CONFIGURAÇÃO GLOBAL
// ==========================================================
const STORAGE_KEY_ADMIN = 'cilantro_users_vFinal';

// ==========================================================
// PARTE 1: LÓGICA DO RESTAURANTE (index.html)
// ==========================================================

// Definição das Classes
class ItemEstoque {
    constructor(id, nome, preco, qtd) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.qtd = qtd;
    }
}

class Mesa {
    constructor(numero) {
        this.numero = numero;
        this.status = 'livre'; // Estados: 'livre', 'ocupada'
        this.pedidos = []; // Lista de itens
    }

    adicionarPedido(item) {
        this.pedidos.push(item);
        this.status = 'ocupada';
    }

    calcularTotal() {
        return this.pedidos.reduce((total, item) => total + item.preco, 0);
    }

    limpar() {
        this.pedidos = [];
        this.status = 'livre';
    }
}

// Dados Iniciais (Baseados no Cardápio PDF)
const mesas = Array.from({ length: 12 }, (_, i) => new Mesa(i + 1));
const estoque = [
    new ItemEstoque(1, "Grão Dourado (Falafel)", 25.99, 15),
    new ItemEstoque(2, "Moqueca do Vale", 13.99, 8),
    new ItemEstoque(3, "Kafta do Sol", 14.49, 10),
    new ItemEstoque(4, "Berinjela da Medina", 13.99, 5),
    new ItemEstoque(5, "Suco Natural", 8.00, 40),
    new ItemEstoque(6, "Pudim Doce do Luar", 6.39, 12)
];

let mesaSelecionada = null;
let totalVendasDia = 0;

// Inicializa apenas se estiver na página principal
if (document.getElementById('grid-mesas')) {
    document.addEventListener('DOMContentLoaded', () => {
        renderizarMesas();
        renderizarEstoque();
        atualizarDashboard();
        
        // Simular alguns pedidos na cozinha visualmente
        adicionarCardCozinha("Mesa 3", "Moqueca do Vale", "Em Preparo");
    });
}

// --- Navegação entre Telas (Abas) ---
function mostrarTela(telaId) {
    // Esconde todas as telas
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    // Mostra a selecionada
    document.getElementById(telaId).classList.remove('hidden');
    
    // Atualiza menu lateral
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    // Adiciona active ao elemento clicado (hack simples para achar o li pai)
    const itens = document.querySelectorAll('.sidebar li');
    if(telaId === 'dashboard') itens[0].classList.add('active');
    if(telaId === 'mesas') itens[1].classList.add('active');
    if(telaId === 'estoque') itens[2].classList.add('active');
    if(telaId === 'pedidos') itens[3].classList.add('active');
}

// --- Funções de Mesa ---
function renderizarMesas() {
    const grid = document.getElementById('grid-mesas');
    if(!grid) return;
    grid.innerHTML = '';

    mesas.forEach(mesa => {
        const card = document.createElement('div');
        // Usa as classes do CSS Premium (livre/ocupada)
        card.className = `mesa-card ${mesa.status}`;
        card.onclick = () => abrirModal(mesa);
        
        const total = mesa.calcularTotal().toFixed(2);
        const infoExtra = mesa.status === 'ocupada' ? `<br><strong>R$ ${total}</strong>` : '';

        card.innerHTML = `
            <h3>Mesa ${mesa.numero}</h3>
            ${infoExtra}
        `;
        grid.appendChild(card);
    });
}

// --- Funções do Modal de Pedidos ---
function abrirModal(mesa) {
    mesaSelecionada = mesa;
    const modal = document.getElementById('modal-comanda');
    modal.classList.remove('hidden'); // Remove hidden para ativar animação CSS
    
    document.getElementById('modal-titulo').innerText = `Mesa ${mesa.numero} (${mesa.status.toUpperCase()})`;
    
    // Popula o Select com itens do estoque
    const select = document.getElementById('select-produto');
    select.innerHTML = '';
    estoque.forEach(item => {
        if(item.qtd > 0) {
            const opt = document.createElement('option');
            opt.value = item.id;
            opt.innerText = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
            select.appendChild(opt);
        }
    });

    atualizarListaComanda();
}

function fecharModal() {
    document.getElementById('modal-comanda').classList.add('hidden');
    renderizarMesas(); // Atualiza a cor das mesas no grid
}

function adicionarPedidoMesa() {
    const idItem = document.getElementById('select-produto').value;
    const itemEstoque = estoque.find(i => i.id == idItem);

    if(itemEstoque && itemEstoque.qtd > 0) {
        // Lógica de negócio: Debita estoque, adiciona na mesa
        itemEstoque.qtd--; 
        mesaSelecionada.adicionarPedido(itemEstoque);
        
        // Manda para a cozinha
        adicionarCardCozinha(`Mesa ${mesaSelecionada.numero}`, itemEstoque.nome, "Novo");
        
        // Atualiza UI
        atualizarListaComanda();
        renderizarEstoque();
    } else {
        alert("Item indisponível ou estoque zerado!");
    }
}

function atualizarListaComanda() {
    const lista = document.getElementById('lista-itens-comanda');
    lista.innerHTML = '';
    
    if (mesaSelecionada.pedidos.length === 0) {
        lista.innerHTML = '<li style="color:#777; justify-content:center;">Nenhum pedido lançado.</li>';
    }

    mesaSelecionada.pedidos.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${p.nome}</span> <span>R$ ${p.preco.toFixed(2)}</span>`;
        lista.appendChild(li);
    });
    
    document.getElementById('total-mesa').innerText = `R$ ${mesaSelecionada.calcularTotal().toFixed(2)}`;
}

function fecharConta() {
    if(mesaSelecionada) {
        const total = mesaSelecionada.calcularTotal();
        if(total > 0) {
            totalVendasDia += total;
            alert(`Conta da Mesa ${mesaSelecionada.numero} fechada com sucesso!\nValor: R$ ${total.toFixed(2)}`);
        }
        mesaSelecionada.limpar();
        atualizarDashboard();
        fecharModal();
    }
}

// --- Funções Auxiliares (Estoque, Dashboard, Cozinha) ---
function renderizarEstoque() {
    const tbody = document.getElementById('tabela-estoque');
    if(!tbody) return;
    tbody.innerHTML = '';
    
    estoque.forEach(item => {
        const statusClass = item.qtd < 5 ? 'alerta-estoque' : '';
        const statusText = item.qtd < 5 ? 'REPOR' : 'OK';
        
        tbody.innerHTML += `
            <tr>
                <td>${item.nome}</td>
                <td>R$ ${item.preco.toFixed(2)}</td>
                <td>${item.qtd}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
            </tr>
        `;
    });
}

function adicionarItemEstoque() {
    const nome = document.getElementById('novo-prato').value;
    const preco = parseFloat(document.getElementById('novo-preco').value);
    
    if(nome && preco) {
        // Gera ID novo e adiciona
        const novoItem = new ItemEstoque(Date.now(), nome, preco, 10);
        estoque.push(novoItem);
        
        // Limpa campos e atualiza tabela
        document.getElementById('novo-prato').value = '';
        document.getElementById('novo-preco').value = '';
        renderizarEstoque();
    }
}

function atualizarDashboard() {
    const elVendas = document.getElementById('total-vendas');
    const elSaldo = document.getElementById('saldo-caixa');
    const despesas = 1500;
    
    if(elVendas) elVendas.innerText = `R$ ${totalVendasDia.toFixed(2)}`;
    if(elSaldo) elSaldo.innerText = `R$ ${(totalVendasDia - despesas).toFixed(2)}`;
}

function adicionarCardCozinha(titulo, prato, status) {
    const container = document.getElementById('lista-pedidos-cozinha');
    if(!container) return;
    
    const card = document.createElement('div');
    card.className = 'card'; // Reusa estilo de card
    card.style.padding = '15px';
    card.style.borderLeftColor = status === 'Novo' ? '#cf6679' : '#FFA500';
    
    card.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
            <strong style="color:var(--primary-green)">${titulo}</strong>
            <small>${new Date().toLocaleTimeString().slice(0,5)}</small>
        </div>
        <p style="font-size:1.1rem; margin:0;">${prato}</p>
        <small style="color:#aaa;">Status: ${status}</small>
    `;
    
    // Adiciona no topo
    container.insertBefore(card, container.firstChild);
}


// ==========================================================
// PARTE 2: LÓGICA DO ADMIN (Requisito Projeto 2 - admin.html)
// ==========================================================

// Verifica se estamos na página de Admin (pela existência do elemento lista-usuarios)
if (document.getElementById('lista-usuarios')) {
    document.addEventListener('DOMContentLoaded', () => {
        renderizarUsuariosAdmin();
        
        // Event Listeners (Projeto 2 Req: Limpar, Pesquisar, Cadastrar)
        document.getElementById('pesquisa').addEventListener('keyup', pesquisarUsuario);
    });
}

// 1. Função de Cadastro (Salva no LocalStorage)
function salvarUsuario() {
    const nome = document.getElementById('admin-nome').value;
    const email = document.getElementById('admin-email').value;

    if (!nome || !email) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const novoUsuario = {
        id: Date.now(),
        // Requisito: Data de envio
        data: new Date().toLocaleString('pt-BR'), 
        nome: nome,
        email: email
    };

    // Recupera do LocalStorage
    let usuarios = JSON.parse(localStorage.getItem(STORAGE_KEY_ADMIN)) || [];
    usuarios.push(novoUsuario);

    // Salva no LocalStorage
    localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(usuarios));

    limparCampos();
    renderizarUsuariosAdmin();
    alert("Usuário cadastrado e salvo no LocalStorage!");
}

// 2. Limpar Campos
function limparCampos() {
    document.getElementById('admin-nome').value = '';
    document.getElementById('admin-email').value = '';
}

// 3. Renderizar Lista e 4. Excluir Item
function renderizarUsuariosAdmin() {
    const ul = document.getElementById('lista-usuarios');
    if(!ul) return;
    ul.innerHTML = '';
    
    const usuarios = JSON.parse(localStorage.getItem(STORAGE_KEY_ADMIN)) || [];
    
    if (usuarios.length === 0) {
        ul.innerHTML = '<li style="justify-content:center; color:#777;">Nenhum registro encontrado no Local Storage.</li>';
        return;
    }

    usuarios.forEach(u => {
        const li = document.createElement('li');
        li.className = 'user-item'; // Classe para busca
        li.innerHTML = `
            <div class="user-details">
                <strong>${u.nome}</strong>
                <small>${u.email}</small>
                <small style="color: var(--accent-green);">Cadastrado em: ${u.data}</small>
            </div>
            <button class="btn-danger" style="width: auto; margin: 0; padding: 8px 15px;" onclick="deletarUsuario(${u.id})">Excluir</button>
        `;
        ul.appendChild(li);
    });
}

// Função precisa ser global para ser chamada pelo onclick do HTML
window.deletarUsuario = function(id) {
    if(confirm("Deseja realmente excluir este usuário?")) {
        let usuarios = JSON.parse(localStorage.getItem(STORAGE_KEY_ADMIN)) || [];
        usuarios = usuarios.filter(u => u.id !== id);
        localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(usuarios));
        renderizarUsuariosAdmin();
    }
};

// 5. Excluir Todos
function excluirTudo() {
    if(confirm("ATENÇÃO: Isso limpará todo o banco de dados local de usuários. Continuar?")) {
        localStorage.removeItem(STORAGE_KEY_ADMIN);
        renderizarUsuariosAdmin();
    }
}

// 6. Pesquisar
function pesquisarUsuario() {
    const termo = document.getElementById('pesquisa').value.toLowerCase();
    const itens = document.querySelectorAll('.user-item');

    itens.forEach(li => {
        const texto = li.innerText.toLowerCase();
        if(texto.includes(termo)) {
            li.style.display = 'flex';
        } else {
            li.style.display = 'none';
        }
    });
}