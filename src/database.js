const fs = require('fs');
const path = require('path');

// Define onde está o arquivo de dados (subindo um nível para sair de src)
const caminhoArquivo = path.join(__dirname, '..', 'dados', 'tarefas.json');

const database = {
    ler: () => {
        try {
            const dados = fs.readFileSync(caminhoArquivo, 'utf8');
            return JSON.parse(dados);
        } catch (erro) {
            return []; // Se o arquivo não existir, retorna lista vazia
        }
    },
    gravar: (tarefas) => {
        try {
            fs.writeFileSync(caminhoArquivo, JSON.stringify(tarefas, null, 2));
            return true;
        } catch (erro) {
            console.error("Erro ao gravar dados:", erro);
            return false;
        }
    }
};

module.exports = database;