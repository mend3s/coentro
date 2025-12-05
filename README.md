# 🌿 Projeto: Restaurante Cilantro Web Manager

> **Instituição:** UTFPR - Universidade Tecnológica Federal do Paraná
> **Disciplina:** Programação Web Front-End
> **Tecnologias:** HTML5, CSS3, JavaScript (Vanilla)
> **Tema:** Pequeno Comércio Local / Gestão de Restaurante

---

## 1. Visão Geral
Este projeto consiste no desenvolvimento de uma aplicação web para o restaurante **Cilantro**, focada na modernização do atendimento e redução de desperdícios (alinhado ao **ODS 12**).

O sistema foi desenvolvido em duas etapas:
1.  **Projeto 1 (Estático):** Construção da interface semântica e estilização.
2.  **Projeto 2 (Dinâmico):** Implementação de funcionalidades de gestão de usuários, manipulação do DOM e persistência de dados local.

### 🎨 Identidade Visual
O design foi concebido para transmitir modernidade e frescor, alinhado à marca "Cilantro".
* **Paleta de Cores:**
    * Verde Musgo (`#556B2F`) e Acento (`#6B8E23`).
    * Fundo Dark (`#121212`, `#1E1E1E`) para conforto visual (Dark Mode).
* **Tipografia:** Fontes *Poppins* (Principal) e *Roboto* (Secundária) para legibilidade e estética limpa.

---

## 2. Estrutura do Projeto

A aplicação utiliza tags semânticas para acessibilidade e boas práticas, dividida nos seguintes arquivos:

### 📂 Arquivos Principais
* `index.html`: **Página Principal.** Contém o Dashboard, Gestão de Mesas, Cardápio/Estoque e Fila da Cozinha.
* `cadastro.html`: **Página de Cadastro.** Formulário público para novos funcionários se candidatarem.
* `admin.html`: **Painel Administrativo.** Módulo exclusivo para gestão de usuários do sistema (CRUD).
* `style.css`: Folha de estilos unificada, contendo variáveis CSS (`:root`), animações e responsividade.
* `script.js`: Lógica do sistema (Manipulação de Arrays, Objetos, DOM e `LocalStorage`).

---

## 3. Funcionalidades e Requisitos Atendidos

### ✅ Projeto 1: HTML e CSS
- [x] **Layout Semântico:** Uso de tags estruturais (`header`, `nav`, `main`, `footer`, `section`).
- [x] **Página de Cadastro:** Formulário com 5 campos (Nome, Email, CPF, Cargo, Senha).
- [x] **Elementos Visuais:**
    - [x] 3+ Imagens (Logo, Ícones de Dashboard).
    - [x] Menu de navegação lateral interativo.
    - [x] Links internos e externos.
- [x] **Estilização:**
    - [x] Uso de variáveis CSS para cores.
    - [x] Importação de 2 fontes do Google Fonts.
    - [x] Validação W3C.

### ✅ Projeto 2: JavaScript e LocalStorage
- [x] **Menu Admin:** Acesso exclusivo via sidebar.
- [x] **Persistência de Dados:** Uso da API `LocalStorage` para salvar usuários.
- [x] **CRUD de Usuários:**
    - [x] **Create:** Cadastro com captura automática de Data/Hora.
    - [x] **Read:** Listagem dinâmica em HTML (`<ul>`).
    - [x] **Delete:** Exclusão de item específico e função "Excluir Todos".
- [x] **Interatividade:**
    - [x] Pesquisa em tempo real (filtro por nome/email).
    - [x] Botão para limpar campos do formulário.

---

## 4. Como Executar

O projeto é estático (Front-End puro), não necessitando de instalação de dependências ou back-end.

1.  Clone este repositório.
2.  Abra o arquivo `index.html` em seu navegador de preferência.
    * *Recomendação:* Utilize a extensão "Live Server" do VS Code para melhor experiência.
3.  Para testar o **Projeto 2**:
    * Navegue até o menu "Admin".
    * Cadastre um usuário e recarregue a página para testar o LocalStorage.

---

## 5. Equipe e Links
* **Repositório GitHub:** [Inserir Link Aqui]
* **GitHub Pages:** [Inserir Link Aqui]
* **Vídeo de Apresentação:** [Inserir Link Aqui]

---

> Desenvolvido por [Nomes dos Integrantes] - 2024/2025
