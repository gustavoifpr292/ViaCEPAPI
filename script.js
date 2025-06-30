document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('cep');
    const consultarBtn = document.getElementById('consultar');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    
    // Permitir apenas números no campo CEP
    cepInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
    
    consultarBtn.addEventListener('click', consultarCEP);
    
    // Consulta ao pressionar Enter
    cepInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            consultarCEP();
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
    }
});