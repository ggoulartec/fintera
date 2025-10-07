import React, {useEffect, useMemo, useState} from 'react';
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {initializeApp, setLogLevel} from 'firebase/app';
import {getAnalytics} from "firebase/analytics";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInAnonymously,
    signInWithCustomToken,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    updateDoc
} from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';

// --- Ícones (SVG como componentes React) ---
const DollarSign = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                              className="h-5 w-5 text-gray-400">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
</svg>;
const FileText = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="h-5 w-5 text-gray-400">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
</svg>;
const Tag = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                       className="h-5 w-5 text-gray-400">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
</svg>;
const SubTagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                              className="h-5 w-5 text-gray-400">
    <path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L12 24l-3-3 10-10-6.4-6.3a2.4 2.4 0 0 1 3.4 0Z"></path>
    <path d="m9 15-3-3 4-4 3 3"></path>
    <path d="m3 21 6-6"></path>
</svg>;
const Calendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="h-5 w-5 text-gray-400">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
</svg>;
const Loader = ({className}) => <svg className={`animate-spin h-5 w-5 ${className}`} xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>;
const Sparkles = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="h-5 w-5">
    <path d="M12 3a6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6Z"></path>
    <path d="M5 3v4"></path>
    <path d="M19 17v4"></path>
    <path d="M3 5h4"></path>
    <path d="M17 19h4"></path>
    <path d="M21 15.08A10 10 0 1 1 8.92 3"></path>
</svg>;
const Lightbulb = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="h-5 w-5">
    <path
        d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7.5a6 6 0 0 0-12 0c0 1.5.3 2.7 1.5 3.9.8.8 1.3 1.5 1.5 2.5"></path>
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
</svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="h-4 w-4">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
</svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="h-4 w-4">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
</svg>;

// --- Configuração do Firebase ---
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

setLogLevel('debug');

// --- Estrutura de Categorias e Subcategorias ---
const categories = {
    'Alimentação': ['Supermercado', 'Restaurante', 'Delivery', 'Café', 'Outros'],
    'Transporte': ['Combustível', 'Transporte Público', 'App de Transporte', 'Manutenção', 'Outros'],
    'Moradia': ['Aluguel', 'Contas (Água, Luz, Gás)', 'Internet', 'Manutenção', 'Móveis', 'Outros'],
    'Lazer': ['Cinema', 'Viagens', 'Hobbies', 'Streaming', 'Eventos', 'Outros'],
    'Saúde': ['Farmácia', 'Consulta', 'Plano de Saúde', 'Academia', 'Outros'],
    'Educação': ['Cursos', 'Livros', 'Mensalidade', 'Outros'],
    'Compras': ['Roupas', 'Eletrônicos', 'Presentes', 'Cosméticos', 'Outros'],
    'Outros': []
};

// --- Componente de Análise com IA (Reutilizável) ---
const AiModal = ({isOpen, onClose, content, isLoading, title, footerNote}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        {title}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Loader className="text-blue-500 h-8 w-8"/>
                            <p className="mt-4 text-gray-600">Processando com IA... Isso pode levar um momento.</p>
                        </div>
                    ) : (
                        <div className="prose prose-lg max-w-none text-gray-700 font-sans">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                    )}
                </div>
                {footerNote && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
                        <p className="text-sm text-gray-500 text-center">{footerNote}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Componente do Modal de Edição ---
const EditExpenseModal = ({expense, onClose, onSave}) => {
    const [description, setDescription] = useState(expense.description);
    const [amount, setAmount] = useState(expense.amount);
    const [category, setCategory] = useState(expense.category);
    const [subCategory, setSubCategory] = useState(expense.subCategory || '');
    const [date, setDate] = useState(expense.date);

    const availableSubCategories = categories[category] || [];

    useEffect(() => {
        if (!categories[category]?.includes(subCategory)) {
            setSubCategory(categories[category]?.[0] || '');
        }
    }, [category, subCategory]);


    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(expense.id, {
            description,
            amount: parseFloat(amount),
            category,
            subCategory,
            date
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Editar Gasto</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)}
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Valor (R$)</label>
                        <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)}
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Categoria</label>
                            <select value={category} onChange={e => setCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Subcategoria</label>
                            <select value={subCategory} onChange={e => setSubCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    disabled={!availableSubCategories.length}>
                                <option value="">{availableSubCategories.length ? 'Selecione' : 'N/A'}</option>
                                {availableSubCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Data</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar
                        </button>
                        <button type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar
                            Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Componente do Modal de Confirmação ---
const ConfirmationModal = ({isOpen, onClose, onConfirm, title, message}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <p className="text-gray-600 my-4">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar
                    </button>
                    <button onClick={onConfirm}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Componente Principal do Dashboard ---
const Dashboard = ({user, handleLogout}) => {
    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Alimentação');
    const [subCategory, setSubCategory] = useState(categories['Alimentação'][0]);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

    const [editingExpense, setEditingExpense] = useState(null);
    const [confirmingDelete, setConfirmingDelete] = useState(null);

    const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);

    const [suggestedCategory, setSuggestedCategory] = useState(null);
    const [suggestedSubCategory, setSuggestedSubCategory] = useState(null);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const [isQuickTipModalOpen, setQuickTipModalOpen] = useState(false);
    const [quickTip, setQuickTip] = useState('');
    const [isQuickTipLoading, setIsQuickTipLoading] = useState(false);

    const availableSubCategories = useMemo(() => categories[category] || [], [category]);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943', '#FFC300', '#C70039'];

    useEffect(() => {
        if (user) {
            const userId = user.uid;
            const expensesCollection = collection(db, 'artifacts', appId, 'users', userId, 'expenses');
            const q = query(expensesCollection, orderBy('createdAt', 'desc'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const expensesData = snapshot.docs.map(doc => ({id: doc.id, ...doc.data(), date: doc.data().date}));
                setExpenses(expensesData);
            }, (error) => console.error("Erro ao buscar despesas: ", error));

            return () => unsubscribe();
        }
    }, [user]);

    useEffect(() => {
        if (description.length < 5) {
            setSuggestedCategory(null);
            setSuggestedSubCategory(null);
            return;
        }

        const handler = setTimeout(async () => {
            setIsSuggesting(true);
            setSuggestedCategory(null);
            setSuggestedSubCategory(null);

            const categoriesForPrompt = JSON.stringify(categories);
            const prompt = `Baseado na descrição da despesa "${description}", classifique-a dentro da seguinte estrutura JSON de categorias e subcategorias: ${categoriesForPrompt}. Sua resposta DEVE ser apenas no formato "Categoria: Subcategoria" (ou "Categoria: " se não houver subcategoria). Exemplo: "Alimentação: Restaurante".`;

            try {
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
                const payload = {contents: [{parts: [{text: prompt}]}]};
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(payload)
                });
                if (!response.ok) throw new Error('API response not OK');
                const result = await response.json();
                const suggestionText = result.candidates?.[0]?.content?.parts?.[0]?.text.trim();

                if (suggestionText && suggestionText.includes(':')) {
                    const [suggestedCat, suggestedSub] = suggestionText.split(':').map(s => s.trim());
                    if (categories[suggestedCat]) {
                        setSuggestedCategory(suggestedCat);
                        if (suggestedSub && categories[suggestedCat].includes(suggestedSub)) {
                            setSuggestedSubCategory(suggestedSub);
                        } else {
                            setSuggestedSubCategory(null);
                        }
                    }
                }

            } catch (error) {
                console.error("Erro ao sugerir categoria:", error);
            } finally {
                setIsSuggesting(false);
            }
        }, 1000);

        return () => clearTimeout(handler);
    }, [description]);

    useEffect(() => {
        setSubCategory(availableSubCategories[0] || '');
    }, [category, availableSubCategories]);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        const userId = auth.currentUser.uid;
        try {
            await addDoc(collection(db, 'artifacts', appId, 'users', userId, 'expenses'), {
                description,
                amount: parseFloat(amount),
                category,
                subCategory,
                date,
                createdAt: Timestamp.fromDate(new Date())
            });
            setDescription('');
            setAmount('');
            setCategory('Alimentação');
            setDate(new Date().toISOString().slice(0, 10));
            setSuggestedCategory(null);
            setSuggestedSubCategory(null);
        } catch (error) {
            console.error("Erro ao adicionar despesa: ", error);
        }
    };

    const handleDeleteRequest = (expenseId) => {
        setConfirmingDelete(expenseId);
    };

    const executeDelete = async () => {
        if (!confirmingDelete) return;
        const userId = auth.currentUser.uid;
        const docRef = doc(db, 'artifacts', appId, 'users', userId, 'expenses', confirmingDelete);
        try {
            await deleteDoc(docRef);
            setConfirmingDelete(null);
        } catch (error) {
            console.error("Erro ao excluir despesa:", error);
        }
    };

    const handleUpdateExpense = async (expenseId, updatedData) => {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, 'artifacts', appId, 'users', userId, 'expenses', expenseId);
        try {
            await updateDoc(docRef, updatedData);
            setEditingExpense(null);
        } catch (error) {
            console.error("Erro ao atualizar despesa:", error);
        }
    };

    const handleAiAnalysis = async () => {
        setAnalysisModalOpen(true);
        setIsAiLoading(true);
        setAiAnalysis("");
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const recentExpenses = expenses.filter(expense => new Date(expense.date) >= oneMonthAgo);

        if (recentExpenses.length < 3) {
            setAiAnalysis("Adicione pelo menos 3 gastos no último mês para obter uma análise detalhada.");
            setIsAiLoading(false);
            return;
        }

        const formattedExpenses = recentExpenses.map(e => `Data: ${e.date}, Categoria: ${e.category} (${e.subCategory || 'N/A'}), Valor: R$${e.amount.toFixed(2)}, Descrição: ${e.description}`).join('\n');
        const systemPrompt = "Você é um consultor financeiro especialista. Analise os gastos e forneça um resumo claro e dicas práticas para economizar. Fale diretamente com o usuário. Formate sua resposta usando Markdown (ex: **Títulos em negrito** e listas com hífens).";
        const userQuery = `Aqui estão meus gastos do último mês:\n${formattedExpenses}\n\nPor favor, analise-os e me dê conselhos práticos.`;

        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
            const payload = {
                contents: [{parts: [{text: userQuery}]}],
                systemInstruction: {parts: [{text: systemPrompt}]}
            };
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`API error: ${response.statusText}`);
            const result = await response.json();
            setAiAnalysis(result.candidates[0].content.parts[0].text);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setAiAnalysis("Ocorreu um erro ao conectar com o serviço de IA. Por favor, tente novamente mais tarde.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleQuickTip = async () => {
        setQuickTipModalOpen(true);
        setIsQuickTipLoading(true);
        setQuickTip('');
        const topCategory = chartData.sort((a, b) => b.value - a.value)[0];

        if (!topCategory) {
            setQuickTip("Adicione alguns gastos este mês para receber uma dica rápida!");
            setIsQuickTipLoading(false);
            return;
        }

        const prompt = `Minha maior despesa este mês é com "${topCategory.name}", totalizando R$${topCategory.value.toFixed(2)}. Me dê uma dica de economia rápida, prática e acionável para reduzir gastos nesta categoria. Seja direto e inspirador. Use Markdown para formatar (negrito para ênfase).`;

        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
            const payload = {contents: [{parts: [{text: prompt}]}]};
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`API error: ${response.statusText}`);
            const result = await response.json();
            setQuickTip(result.candidates[0].content.parts[0].text);
        } catch (error) {
            console.error("Error getting quick tip:", error);
            setQuickTip("Não foi possível gerar a dica. Tente novamente mais tarde.");
        } finally {
            setIsQuickTipLoading(false);
        }
    };

    const monthlyExpenses = useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });
    }, [expenses]);

    const chartData = useMemo(() => {
        const dataMap = monthlyExpenses.reduce((acc, expense) => {
            const {category, amount} = expense;
            if (!acc[category]) acc[category] = 0;
            acc[category] += amount;
            return acc;
        }, {});
        return Object.entries(dataMap).map(([name, value]) => ({name, value}));
    }, [monthlyExpenses]);

    // ✨ NOVA FEATURE: Cálculo do Gasto Total do Mês
    const totalMonthlyAmount = useMemo(() => {
        return monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
    }, [monthlyExpenses]);

    return (
        <div className="min-h-screen bg-gray-100 font-sans" style={{minWidth: '768px'}}>
            <header className="bg-white shadow-sm">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">Fintera</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 hidden sm:block">Olá, {user.displayName || user.email}</span>
                        <button onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                            Sair
                        </button>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Adicionar Novo Gasto</h2>
                            <form onSubmit={handleAddExpense} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FileText/></div>
                                        <input type="text" value={description}
                                               onChange={e => setDescription(e.target.value)}
                                               placeholder="Ex: Café da manhã na padaria"
                                               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Valor (R$)</label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <DollarSign/></div>
                                        <input type="number" step="0.01" value={amount}
                                               onChange={e => setAmount(e.target.value)} placeholder="0.00"
                                               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            className="block text-sm font-medium text-gray-600 mb-1">Categoria</label>
                                        <div className="relative">
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Tag/></div>
                                            <select value={category} onChange={e => setCategory(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-blue-500 focus:border-blue-500">
                                                {Object.keys(categories).map(cat => <option key={cat}
                                                                                            value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            className="block text-sm font-medium text-gray-600 mb-1">Subcategoria</label>
                                        <div className="relative">
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <SubTagIcon/></div>
                                            <select value={subCategory} onChange={e => setSubCategory(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-blue-500 focus:border-blue-500"
                                                    disabled={!availableSubCategories.length}>
                                                <option
                                                    value="">{availableSubCategories.length ? 'Selecione' : 'N/A'}</option>
                                                {availableSubCategories.map(sub => <option key={sub}
                                                                                           value={sub}>{sub}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {(isSuggesting || suggestedCategory) && (
                                    <div
                                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                                        {isSuggesting ? (
                                            <div className="flex items-center"><Loader
                                                className="text-yellow-600 h-4 w-4 mr-2"/>Sugerindo categoria...</div>
                                        ) : suggestedCategory ? (
                                            <div>
                                                <span>✨ Sugestão: </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCategory(suggestedCategory);
                                                        setSubCategory(suggestedSubCategory || '');
                                                    }}
                                                    className="font-bold hover:underline"
                                                >
                                                    {suggestedCategory} {suggestedSubCategory ? `> ${suggestedSubCategory}` : ''}
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Data</label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Calendar/></div>
                                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                                               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                                    </div>
                                </div>
                                <button type="submit"
                                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                                    Adicionar Gasto
                                </button>
                            </form>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Gastos Recentes</h2>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                {expenses.length > 0 ? (
                                    expenses.map(expense => (
                                        <div key={expense.id}
                                             className="flex justify-between items-center bg-gray-50 p-3 rounded-lg group">
                                            <div>
                                                <p className="font-semibold text-gray-700">{expense.description}</p>
                                                <p className="text-sm text-gray-500">{expense.category} {expense.subCategory ? `> ${expense.subCategory}` : ''} - {new Date(expense.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span
                                                    className="font-bold text-red-500">R$ {expense.amount.toFixed(2)}</span>
                                                <div
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                                    <button onClick={() => setEditingExpense(expense)}
                                                            className="p-1 text-blue-500 hover:bg-blue-100 rounded-full">
                                                        <EditIcon/></button>
                                                    <button onClick={() => handleDeleteRequest(expense.id)}
                                                            className="p-1 text-red-500 hover:bg-red-100 rounded-full">
                                                        <TrashIcon/></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">Nenhum gasto adicionado ainda.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Resumo do Mês Atual</h2>

                            {/* Gasto Total do Mês */}
                            <div className="my-6 text-center bg-gray-50 p-4 rounded-xl">
                                <p className="text-md text-gray-500">Gasto Total do Mês</p>
                                <p className="text-4xl font-bold text-red-500">
                                    R$ {totalMonthlyAmount.toFixed(2).replace('.', ',')}
                                </p>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Distribuição por Categoria</h3>
                            <div style={{width: '100%', height: 350}}>
                                <ResponsiveContainer>
                                    {chartData.length > 0 ? (
                                        <PieChart>
                                            <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={120}
                                                 fill="#8884d8" dataKey="value"
                                                 label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                                {chartData.map((entry, index) => <Cell key={`cell-${index}`}
                                                                                       fill={COLORS[index % COLORS.length]}/>)}
                                            </Pie>
                                            <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`}/>
                                            <Legend/>
                                        </PieChart>
                                    ) : (<div className="flex items-center justify-center h-full"><p
                                        className="text-gray-500">Adicione um gasto para ver o gráfico.</p></div>)}
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="mt-8 text-center space-y-4">
                            <button onClick={handleQuickTip}
                                    className="w-full max-w-md mx-auto bg-white border border-blue-500 text-blue-500 font-bold py-3 px-6 rounded-xl shadow-sm hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center"
                                    disabled={isQuickTipLoading}>
                                {isQuickTipLoading ? <Loader className="text-blue-500"/> : <Lightbulb/>}
                                <span className="ml-2">✨ Dica Rápida de Economia</span>
                            </button>
                            <button onClick={handleAiAnalysis}
                                    className="w-full max-w-md mx-auto bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center"
                                    disabled={isAiLoading}>
                                {isAiLoading ? <Loader className="text-white"/> : <Sparkles/>}
                                <span className="ml-2">Analisar Meus Gastos com IA</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <AiModal isOpen={isAnalysisModalOpen} onClose={() => setAnalysisModalOpen(false)} content={aiAnalysis}
                     isLoading={isAiLoading}
                     title={<><Sparkles/><span className="ml-2">Análise Financeira Inteligente</span></>}
                     footerNote="Esta é uma análise gerada por IA. Use como um guia e não como um conselho financeiro profissional."/>
            <AiModal isOpen={isQuickTipModalOpen} onClose={() => setQuickTipModalOpen(false)} content={quickTip}
                     isLoading={isQuickTipLoading}
                     title={<><Lightbulb/><span className="ml-2">Dica Rápida de Economia</span></>}/>
            {editingExpense && <EditExpenseModal expense={editingExpense} onClose={() => setEditingExpense(null)}
                                                 onSave={handleUpdateExpense}/>}
            <ConfirmationModal isOpen={!!confirmingDelete} onClose={() => setConfirmingDelete(null)}
                               onConfirm={executeDelete} title="Confirmar Exclusão"
                               message="Tem certeza que deseja excluir este gasto? Esta ação não pode ser desfeita."/>
        </div>
    );
};

// --- Componente de Autenticação ---
const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                if (!name) {
                    setError("O nome é obrigatório para o cadastro.");
                    return;
                }
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, {displayName: name});
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans p-4"
             style={{minWidth: '768px'}}>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <h1 className="text-3xl font-bold text-center text-blue-600">Fintera</h1>
                <p className="text-center text-gray-600">{isLogin ? 'Faça login para acessar sua conta.' : 'Crie sua conta para começar.'}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                   required={!isLogin}/>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                               required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                               required/>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">{isLogin ? 'Entrar' : 'Cadastrar'}</button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
                    <button onClick={() => setIsLogin(!isLogin)}
                            className="font-medium text-blue-600 hover:text-blue-500">{isLogin ? 'Cadastre-se' : 'Faça login'}</button>
                </p>
            </div>
        </div>
    );
};


// --- Componente Raiz da Aplicação ---
export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authAndListen = async () => {
            try {
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Authentication error:", error);
            }

            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
                setLoading(false);
            });
            return () => unsubscribe();
        };

        authAndListen();
    }, []);

    const handleLogout = () => {
        signOut(auth).catch(error => console.error("Logout Error:", error));
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><p>Carregando...</p></div>;
    }

    return user && !user.isAnonymous ? <Dashboard user={user} handleLogout={handleLogout}/> : <AuthPage/>;
}

