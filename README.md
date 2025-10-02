# Fintera - App de Orçamento Inteligente com IA

Fintera é uma aplicação web moderna de controle financeiro pessoal, projetada para ajudar usuários a entenderem e otimizarem seus gastos.  
Com uma interface limpa e intuitiva, o app não só permite o registro de despesas, mas também utiliza o poder da **Inteligência Artificial (Google Gemini)** para fornecer análises, sugestões e dicas personalizadas.

---

## ✨ Funcionalidades
- 🔐 **Autenticação Segura**: Sistema de cadastro e login com e-mail e senha.
- 💸 **Registro Simples de Gastos**: Adicione despesas rapidamente com valor, descrição, categoria e data.
- 📝 **Edição e Exclusão de Gastos**: Modifique ou remova qualquer lançamento com facilidade.
- 📊 **Dashboard Visual**: Gráfico de pizza interativo que mostra a distribuição de gastos por categoria no mês atual.
- 🧠 **Análise Completa com IA**: Um consultor financeiro virtual que analisa seus gastos do último mês e fornece um relatório detalhado com dicas práticas para economizar.
- 💡 **Sugestão de Categoria por IA**: Ao digitar a descrição de um gasto, a IA sugere a categoria mais adequada automaticamente.
- ⚡ **Dica Rápida com IA**: Obtenha uma dica de economia instantânea e focada na sua maior categoria de despesa do mês, com formatação rica (Markdown).
- ☁️ **Sincronização na Nuvem**: Seus dados são salvos de forma segura e privada com o Firebase Firestore.

---

## 🛠️ Tecnologias Utilizadas
- **Frontend**: React (com Vite)
- **Estilização**: Tailwind CSS
- **Gráficos**: Recharts
- **Renderização de Markdown**: react-markdown
- **Backend & Banco de Dados**: Google Firebase (Authentication & Firestore)
- **Inteligência Artificial**: Google Gemini API

---

## 🚀 Instalação e Configuração

### Pré-requisitos
Antes de começar, você precisará ter o **Node.js** instalado.  
Baixe a versão LTS em [nodejs.org](https://nodejs.org).

Para verificar se a instalação foi bem-sucedida, abra seu terminal e execute:
```bash
node -v
npm -v
```

### 1. Crie o Projeto React
```bash
# Crie um novo projeto React com Vite e acesse a pasta
npm create vite@latest fintera-app -- --template react
cd fintera-app
```

### 2. Instale as Dependências
Execute os seguintes comandos para instalar todas as bibliotecas necessárias para o projeto, incluindo as versões estáveis do Tailwind CSS.

```bash
# Instala as dependências principais do projeto
npm install firebase recharts react-markdown

# Instala o Tailwind CSS e suas dependências (versões estáveis)
npm install -D tailwindcss@^3.0.0 postcss@^8.0.0 autoprefixer@^10.0.0
```

### 3. Configure o Tailwind CSS
```bash
# Crie os arquivos de configuração do Tailwind e PostCSS
npx tailwindcss init -p
```

Substitua o conteúdo do seu **tailwind.config.js** por:
```js
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
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Configure as Variáveis de Ambiente (MUITO IMPORTANTE)
Para manter suas chaves de API seguras, **NUNCA** as coloque diretamente no código. Use um arquivo de ambiente.

Na pasta raiz do seu projeto (**fintera-app**), crie um arquivo chamado **.env**.  
Dentro do arquivo **.env**, cole o conteúdo abaixo, substituindo os valores pelas suas chaves reais do Firebase e do Google AI Studio.

```env
# Cole suas credenciais do Firebase aqui
VITE_FIREBASE_API_KEY="SUA_API_KEY_DO_FIREBASE"
VITE_FIREBASE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
VITE_FIREBASE_PROJECT_ID="SEU_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="SEU_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="SEU_APP_ID"
VITE_FIREBASE_MEASUREMENT_ID="SEU_MEASUREMENT_ID"

# Cole sua chave da API do Google Gemini aqui
VITE_GEMINI_API_KEY="SUA_API_KEY_DO_GEMINI"
```

➡️ Adicione a linha **.env** ao final do seu arquivo **.gitignore** para evitar que suas chaves secretas sejam enviadas para o GitHub.

### 5. Configure o Firebase
1. Acesse o [Firebase Console](https://console.firebase.google.com/) e crie seu projeto.
2. No painel, ative os seguintes serviços:
    - **Authentication**: Vá para a aba "Sign-in method" e ative os provedores "E-mail/senha" e "Anônimo".
    - **Firestore Database**: Crie um novo banco de dados (inicie em modo de teste).
3. Vá para as **Configurações do projeto** (*Project settings*) e adicione um novo **Aplicativo da Web** (</>) para obter as credenciais que você colou no arquivo `.env`.

### 6. Adicione o Código do Aplicativo
Copie todo o código-fonte do **Fintera** que eu te forneci.

Abra o arquivo **src/App.jsx** no seu editor, apague o conteúdo padrão e cole o código do Fintera.  
O código já está preparado para ler as variáveis do arquivo **.env**.

### 7. Rode a Aplicação
Finalmente, inicie o servidor de desenvolvimento.  
Lembre-se de reiniciar o servidor sempre que alterar o arquivo **.env**.

```bash
npm run dev
```

Abra seu navegador e acesse o endereço fornecido (geralmente [http://localhost:5173](http://localhost:5173)).  
✅ Pronto! O **Fintera** estará funcionando localmente.
