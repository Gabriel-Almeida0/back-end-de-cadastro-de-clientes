const axios = require('axios');
const readline = require('readline');

// Configuração do readline para capturar entrada do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Base URL da sua API
const baseURL = 'http://localhost:5000';

// Função para fazer GET
const fazerGET = async () => {
  const idGET = await capturarIdCliente();
  try {
    const response = await axios.get(`${baseURL}/cliente/${idGET}`);
    console.log('\nResposta GET:', response.data);
  } catch (error) {
    console.error('\nErro no GET:', error.response ? error.response.data : error.message);
  }
};

// Função para fazer POST
const fazerPOST = async (cliente) => {
  try {
    const response = await axios.post(`${baseURL}/cadastro`, cliente);
    console.log('\nResposta POST:', response.data);
  } catch (error) {
    console.error('\nErro no POST:', error.response ? error.response.data : error.message);
  }
};

// Função para fazer PUT (atualização completa)
const fazerPUT = async (clienteAtualizado) => {
  const idPUT = '1'; // ID fixo ou fornecido pelo servidor
  console.log(`Realizando PUT com ID: ${idPUT} e dados: ${JSON.stringify(clienteAtualizado)}`); // Log para depuração
  try {
    const response = await axios.put(`${baseURL}/cliente/${idPUT}`, clienteAtualizado);
    console.log('\nResposta PUT:', response.status, response.data);
  } catch (error) {
    console.error('\nErro no PUT:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados de erro:', error.response.data);
    } else {
      console.error('Mensagem de erro:', error.message);
    }
  }
};

// Função para fazer PATCH (atualização parcial)
const fazerPATCH = async () => {
  const idPATCH = await capturarIdCliente();  // Captura o ID do cliente
  const clienteParcial = await capturarDadosCliente();  // Captura os dados a serem atualizados

  console.log(`Realizando PATCH com ID: ${idPATCH} e dados: ${JSON.stringify(clienteParcial)}`); // Log para depuração

  try {
    const response = await axios.patch(`${baseURL}/cliente/${idPATCH}`, clienteParcial);
    console.log('\nResposta PATCH:', response.status, response.data);
  } catch (error) {
    console.error('\nErro no PATCH:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados de erro:', error.response.data);
    } else {
      console.error('Mensagem de erro:', error.message);
    }
  }
};

// Função para fazer DELETE
const fazerDELETE = async (id) => {
  try {
    const response = await axios.delete(`${baseURL}/cliente/${id}`);
    console.log('\nResposta DELETE:', response.data);
  } catch (error) {
    console.error('\nErro no DELETE:', error.response ? error.response.data : error.message);
  }
};

// Função para capturar a entrada do usuário sobre qual método HTTP usar
const capturarEntrada = () => {
  return new Promise((resolve) => {
    rl.question('\nEscolha o método HTTP (GET, POST, PUT, PATCH, DELETE) ou digite "Sair" para encerrar: ', (metodo) => {
      resolve(metodo.toUpperCase().trim());
    });
  });
};

// Função para capturar os dados necessários para os métodos POST, PUT ou PATCH
const capturarDadosCliente = () => {
  return new Promise((resolve) => {
    rl.question('Digite os dados do cliente (nome, idade, celular): ', (dados) => {
      const [nome, idade, celular] = dados.split(',');

      if (!nome || !idade || !celular || isNaN(parseInt(idade.trim())) || !/^\d{2}\d{9}$/.test(celular.trim())) {
        console.log('Dados inválidos! Certifique-se de digitar nome, idade e celular corretamente.');
        resolve(capturarDadosCliente()); // Chama novamente caso o dado seja inválido
      } else {
        resolve({ nome: nome.trim(), idade: parseInt(idade.trim()), celular: celular.trim() });
      }
    });
  });
};

// Função para capturar ID do cliente
const capturarIdCliente = () => {
  return new Promise((resolve) => {
    rl.question('Digite o ID do cliente: ', (id) => {
      if (isNaN(parseInt(id.trim()))) {
        console.log('ID inválido! O ID deve ser um número.');
        resolve(capturarIdCliente()); // Chama novamente caso o ID seja inválido
      } else {
        resolve(id.trim());
      }
    });
  });
};

// Função principal para controle de fluxo
const menuPrincipal = async () => {
  let continuar = true;

  while (continuar) {
    const metodo = await capturarEntrada();

    if (metodo === 'SAIR') {
      console.log('Saindo... Até logo!');
      rl.close();
      break;
    }

    switch (metodo) {
      case 'GET':
        await fazerGET();  // Agora o GET solicita o ID
        break;

      case 'POST':
        const clientePOST = await capturarDadosCliente();
        await fazerPOST(clientePOST);
        break;

      case 'PUT':
        const clientePUT = await capturarDadosCliente();
        await fazerPUT(clientePUT); // Não precisa solicitar o ID no PUT
        break;

      case 'PATCH':
        await fazerPATCH(); // Agora o PATCH solicita o ID e os dados a serem atualizados
        break;

      case 'DELETE':
        const idDELETE = await capturarIdCliente();
        await fazerDELETE(idDELETE);
        break;

      default:
        console.log('Método inválido. Tente novamente.');
        break;
    }
  }
};

// Inicia o menu principal
menuPrincipal();
