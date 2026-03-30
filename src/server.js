const express = require('express');
const db = require('./database');
const app = express();

app.use(express.json());

// Rota GET: Listar tarefas (Ponto 2 do Checkpoint)
app.get('/tarefas', (req, res) => {
    const tarefas = db.ler();
    console.log(JSON.stringify({ nivel: "INFO", mensagem: "Listagem de tarefas solicitada" }));
    res.status(200).json(tarefas);
});

// Rota POST: Criar tarefa (Status 201 Created)
app.post('/tarefas', (req, res) => {
    // 1. Capturamos os dois campos do corpo da requisição
    const { titulo, descricao } = req.body; 
    
    if (!titulo) return res.status(400).json({ erro: "Título é obrigatório" });

    const tarefas = db.ler();
    
    // 2. Incluímos a descrição aqui para ela ser gravada
    const novaTarefa = { 
        id: Date.now(), 
        titulo, 
        descricao: descricao || "Sem descrição", 
        status: "pendente" 
    };
    
    tarefas.push(novaTarefa);
    db.gravar(tarefas);

    console.log(JSON.stringify({ nivel: "INFO", mensagem: `Tarefa criada: ${titulo}` }));
    res.status(201).json(novaTarefa);
});
// Rota DELETE: Remover uma tarefa específica pelo ID
app.delete('/tarefas/:id', (req, res) => {
    // 1. Pegamos o ID da URL. O ":" no código indica que é um parâmetro variável
    const idParaApagar = Number(req.params.id);
    
    const tarefas = db.ler();
    
    // 2. Criamos uma nova lista filtrando (tirando) quem tem o ID que queremos apagar
    const tarefasFiltradas = tarefas.filter(t => t.id !== idParaApagar);
    
    // Se o tamanho da lista não mudou, significa que o ID não existia
    if (tarefas.length === tarefasFiltradas.length) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    // 3. Gravamos a lista atualizada (sem a tarefa apagada) no arquivo
    db.gravar(tarefasFiltradas);

    console.log(JSON.stringify({ 
        nivel: "INFO", 
        mensagem: `Tarefa removida com sucesso. ID: ${idParaApagar}` 
    }));

    res.status(200).json({ mensagem: "Tarefa removida com sucesso" });
});
// Rota PUT: Atualização completa (Título e Descrição)
app.put('/tarefas/:id', (req, res) => {
    const id = Number(req.params.id);
    const { titulo, descricao } = req.body;
    
    let tarefas = db.ler();
    const index = tarefas.findIndex(t => t.id === id);

    if (index === -1) return res.status(404).json({ erro: "Tarefa não encontrada" });

    // Substituímos os dados mantendo o ID original
    tarefas[index] = { ...tarefas[index], titulo, descricao };
    db.gravar(tarefas);

    res.status(200).json(tarefas[index]);
});

// Rota PATCH: Atualização parcial (Mudar apenas o Status)
app.patch('/tarefas/:id/status', (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body; // Recebemos o novo status (ex: "concluido")

    let tarefas = db.ler();
    const index = tarefas.findIndex(t => t.id === id);

    if (index === -1) return res.status(404).json({ erro: "Tarefa não encontrada" });

    // Alteramos apenas o campo status
    tarefas[index].status = status;
    db.gravar(tarefas);

    res.status(200).json(tarefas[index]);
});

// Buscamos as variáveis que defini no .env
const PORTA = process.env.PORT || 3000; 
const NOME = process.env.APP_NOME || "API";

app.listen(PORTA, () => {
    // Usamos Crase (``) para conseguir colocar as variáveis dentro do texto
    console.log(`-----------------------------------------`);
    console.log(`${NOME} ONLINE NA PORTA ${PORTA}`);
    console.log(`-----------------------------------------`);
});