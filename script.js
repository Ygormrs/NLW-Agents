const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

const PerguntarIA = async (question, game, apiKey) => {
    const model = 'gemini-2.5-flash'
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const perguntaLOL = `
        ## Especialidade
        Você é um especialista assistente de meta para o jogo League Of Legends

        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas
        
        ## Regras
        -Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
        -Se a pergunta não está relacionada ao jogo, responda com
        'Essa pergunta não está relacionada ao jogo'
        -Considere a data atual ${new Date().toLocaleDateString()}
        -Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
        -Nunca responda itens que você não tenha certeza de que existe do patch atual.

        ## Resposta
        -Economize na resposta, seja direto e responda no máximo 500 caracteres. 
        -Responda em markdown.
        -Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

        ## Exemplo de resposta
        Pergunta do usuário: Melhor build rengar jungle.
        Resposta: A build mais atual é: 
        **Itens:**
        Coloque os itens aqui:
        **Runas:**
        Exemplo de Runas

        -----------------------

        Aqui está a pergunta do usuário: ${question}
    `
    const perguntaValorant = `
        ## Especialidade
        Você é um especialista assistente de meta para o jogo Valorant

        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, agentes, composições, mapas e dicas.

        ## Regras
        -Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.  
        -Se a pergunta não está relacionada ao jogo, responda com  
        'Essa pergunta não está relacionada ao jogo'  
        -Considere a data atual ${new Date().toLocaleDateString()}  
        -Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.  
        -Nunca responda itens que você não tenha certeza de que existem no patch atual.  

        ## Resposta
        -Economize na resposta, seja direto e responda no máximo 500 caracteres.  
        -Responda em markdown.  
        -Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.  

        ## Exemplo de resposta
        Pergunta do usuário: Qual o melhor agente para subir de elo jogando solo?  
        Resposta: No patch atual, **Reyna** e **Raze** são ótimas escolhas para solo queue. Alta capacidade de carregar partidas e independência tática.

        -----------------------

        Aqui está a pergunta do usuário: ${question}
    `
    const perguntaCSGO = `
        ## Especialidade
        Você é um especialista assistente de meta para o jogo CS:GO

        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, economia, utilitários, mapas, armas e dicas para melhorar o desempenho.

        ## Regras
        -Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.  
        -Se a pergunta não está relacionada ao jogo, responda com  
        'Essa pergunta não está relacionada ao jogo'  
        -Considere a data atual ${new Date().toLocaleDateString()}  
        -Faça pesquisas atualizadas sobre o meta e estratégias atuais, baseadas na data atual, para dar uma resposta coerente.  
        -Nunca responda informações que você não tenha certeza de que estão válidas no patch atual.  

        ## Resposta
        -Seja direto e objetivo. Limite a resposta a no máximo 500 caracteres.  
        -Responda em markdown.  
        -Não inclua saudações ou despedidas, apenas o conteúdo solicitado.  

        ## Exemplo de resposta
        Pergunta do usuário: Qual o melhor pixel para smocar a varanda da Mirage no TR?  
        Resposta: Posicione-se na base TR encostado na parede, alinhe a mira com a borda da janela do prédio à frente e jogue a smoke com pulo. Essa smoke cobre a varanda e impede avanço CT.

        -----------------------

        Aqui está a pergunta do usuário: ${question}
    `

    let pergunta = ''

    if(game == 'League Of Legends'){
      pergunta = perguntaLOL
    }

    if(game == 'Valorant'){
      pergunta = perguntaValorant
    }

    if(game == 'CS:GO'){
      pergunta = perguntaCSGO
    }

    const contents = [{
        role: 'user',
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]

    //chamada API
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    }) 
    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}

const sendForm = async (event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value

    if (apiKey == '' || game == '' || question == ''){
        alert('Por favor, preencha todos os campos')
        return 
    }

    askButton.disabled = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')

    try{
        const text = await PerguntarIA(question, game, apiKey)
        aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
        aiResponse.classList.remove('hidden')
    } catch(error){
        console.log('Erro: ', error)
    } finally{
        askButton.disabled = false
        askButton.textContent = 'Perguntar'
        askButton.classList.remove('loading')
    }
}
form.addEventListener('submit', sendForm)
