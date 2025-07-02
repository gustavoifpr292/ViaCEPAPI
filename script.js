document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('cep');
    const consultarBtn = document.getElementById('consultar');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const nomeInput = document.getElementById('nome');
    const adicionarBtn = document.getElementById('adicionar');
    const pessoasContainer = document.getElementById('pessoas-container');
    
    let cepData = null; 
    let pessoas = JSON.parse(localStorage.getItem('pessoas')) || []; // Carrega a lista do localStorage

    // Permitir apenas números no campo CEP
    cepInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
    
    consultarBtn.addEventListener('click', consultarCEP);
    adicionarBtn.addEventListener('click', adicionarPessoa);
    
    // Consulta ao pressionar Enter no campo CEP
    cepInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            consultarCEP();
        }
    });
    
    // Adicionar pessoa ao pressionar Enter no campo Nome
    nomeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            adicionarPessoa();
        }
    });
    
    function consultarCEP() {
        const cep = cepInput.value.trim();
        
        // Validar CEP (8 dígitos)
        if (cep.length !== 8 || !/^\d+$/.test(cep)) {
            showError();
            return;
        }
        
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    showError();
                } else {
                    cepData = data; // Armazena os dados do CEP
                    displayResult(data);
                }
            })
            .catch(() => {
                showError();
            });
    }
    
    function displayResult(data) {
        errorDiv.style.display = 'none';
        
        // Preencher os campos com os dados retornados
        document.getElementById('cep-resultado').textContent = data.cep || '-';
        document.getElementById('logradouro').textContent = data.logradouro || '-';
        document.getElementById('complemento').textContent = data.complemento || '-';
        document.getElementById('bairro').textContent = data.bairro || '-';
        document.getElementById('localidade').textContent = data.localidade || '-';
        document.getElementById('uf').textContent = data.uf || '-';
        document.getElementById('ibge').textContent = data.ibge || '-';
        document.getElementById('ddd').textContent = data.ddd || '-';
        
        resultDiv.style.display = 'block';
    }
    
    function showError() {
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        cepData = null; // Limpa os dados do CEP em caso de erro
    }
    
    function adicionarPessoa() {
        const nome = nomeInput.value.trim();
        
        if (!nome) {
            alert('Por favor, digite um nome válido.');
            return;
        }
        
        if (!cepData) {
            alert('Por favor, consulte um CEP válido primeiro.');
            return;
        }
        
        // Cria o objeto da pessoa
        const pessoa = {
            nome: nome,
            cep: cepData.cep,
            endereco: `${cepData.logradouro || ''} ${cepData.complemento || ''}`.trim(),
            bairro: cepData.bairro,
            cidade: cepData.localidade,
            uf: cepData.uf
        };
        
        // Adiciona à lista
        pessoas.push(pessoa);
        
        // Atualiza a exibição e salva no localStorage
        atualizarListaPessoas();
        
        // Limpa os campos
        nomeInput.value = '';
        cepInput.value = '';
        resultDiv.style.display = 'none';
        cepData = null;
    }
    
    function atualizarListaPessoas() {
        pessoasContainer.innerHTML = '';
        
        if (pessoas.length === 0) {
            pessoasContainer.innerHTML = '<p>Nenhuma pessoa cadastrada ainda.</p>';
            localStorage.setItem('pessoas', JSON.stringify(pessoas)); // Atualiza localStorage
            return;
        }
        
        pessoas.forEach((pessoa, index) => {
            const pessoaDiv = document.createElement('div');
            pessoaDiv.className = 'pessoa-item';
            
            pessoaDiv.innerHTML = `
                <p><strong>Nome:</strong> ${pessoa.nome}</p>
                <p><strong>Endereço:</strong> ${pessoa.endereco || '-'}</p>
                <p><strong>Bairro:</strong> ${pessoa.bairro || '-'}</p>
                <p><strong>Cidade/UF:</strong> ${pessoa.cidade || '-'}/${pessoa.uf || '-'}</p>
                <p><strong>CEP:</strong> ${pessoa.cep || '-'}</p>
                <button class="remover-pessoa" data-index="${index}">Remover</button>
            `;
            
            pessoasContainer.appendChild(pessoaDiv);
        });

        // Adiciona event listeners aos botões de remover
        document.querySelectorAll('.remover-pessoa').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                pessoas.splice(index, 1);
                localStorage.setItem('pessoas', JSON.stringify(pessoas));
                atualizarListaPessoas();
            });
        });
        
        // Salva no localStorage
        localStorage.setItem('pessoas', JSON.stringify(pessoas));
    }
    
    // Inicializa a lista (carrega do localStorage)
    atualizarListaPessoas();
});