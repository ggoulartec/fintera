Fintera - App de Orçamento Inteligente com IA Fintera é uma aplicação
web moderna de controle financeiro pessoal, projetada para ajudar
usuários a entenderem e otimizarem seus gastos. Com uma interface limpa
e intuitiva, o app não só permite o registro de despesas, mas também
utiliza o poder da Inteligência Artificial (Google Gemini) para fornecer
análises, sugestões e dicas personalizadas.

✨ Funcionalidades - 🔐 **Autenticação Segura**: Sistema de cadastro e
login com e-mail e senha. - 💸 **Registro Simples de Gastos**: Adicione
despesas rapidamente com valor, descrição, categoria e data. - 📊
**Dashboard Visual**: Gráfico de pizza interativo que mostra a
distribuição de gastos por categoria no mês atual. - 🧠 **Análise
Completa com IA**: Um consultor financeiro virtual que analisa seus
gastos do último mês e fornece um relatório detalhado com dicas práticas
para economizar. - 💡 **Sugestão de Categoria por IA**: Ao digitar a
descrição de um gasto, a IA sugere a categoria mais adequada
automaticamente. - ⚡ **Dica Rápida com IA**: Obtenha uma dica de
economia instantânea e focada na sua maior categoria de despesa do
mês. - ☁️ **Sincronização na Nuvem**: Seus dados são salvos de forma
segura e privada com o Firebase Firestore.

🛠️ Tecnologias Utilizadas - **Frontend**: React (com Vite) -
**Estilização**: Tailwind CSS - **Gráficos**: Recharts - **Backend &
Banco de Dados**: Google Firebase (Authentication & Firestore) -
**Inteligência Artificial**: Google Gemini API

🚀 Instalação e Configuração Siga os passos abaixo para rodar o projeto
em sua máquina local.

### Pré-requisitos

Antes de começar, você precisará ter o Node.js instalado. Baixe a versão
LTS em [nodejs.org](https://nodejs.org).

Para verificar se a instalação foi bem-sucedida, abra seu terminal e
execute:

``` bash
node -v
npm -v
```

### 1. Crie o Projeto e Instale as Dependências

``` bash
# 1. Crie um novo projeto React com Vite
npm create vite@latest fintera-app -- --template react

# 2. Acesse o diretório do projeto
cd fintera-app

# 3. Instale as dependências principais
npm install

# 4. Instale as bibliotecas específicas do projeto
npm install firebase recharts

# 5. Instale o Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Configure o Tailwind CSS

Substitua o conteúdo do seu **tailwind.config.js** por:

``` js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Substitua o conteúdo do seu **src/index.css** por:

``` css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Configure o Firebase

O aplicativo precisa se conectar a um projeto Firebase para o login e
banco de dados.

1.  Acesse o [Firebase Console](https://console.firebase.google.com/) e
    crie um novo projeto.
2.  Adicione um novo aplicativo da Web (\</\>) ao seu projeto.
3.  Copie o objeto de configuração `firebaseConfig` fornecido.
4.  No seu código, dentro do arquivo **src/App.jsx**, cole essa
    configuração. O início do seu arquivo deve ficar assim:

``` jsx
import React from 'react';
// ... outros imports
import { initializeApp } from 'firebase/app';

// COLE AQUI A SUA CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SUA_APP_ID"
};

// O restante do código continua abaixo...
```

No painel do Firebase, ative a **Authentication** (provedor
"E-mail/senha") e o **Firestore Database** (inicie em modo de teste).

### 4. Adicione o Código do Aplicativo

Copie todo o código-fonte do Fintera que eu te forneci.

Abra o arquivo **src/App.jsx** no seu editor de código, apague o
conteúdo padrão e cole o código do Fintera.

### 5. Rode a Aplicação

Finalmente, inicie o servidor de desenvolvimento:

``` bash
npm run dev
```

Abra seu navegador e acesse o endereço fornecido (geralmente
<http://localhost:5173>).\
Pronto! O Fintera estará funcionando localmente.
