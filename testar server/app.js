const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const baseURL = 'http://localhost:5000';

const fazerGET = async () => {
  const idGET = await capturarIdCliente();
  try {
    const response = await axios.get(`${baseURL}/cliente/${idGET}`);
    console.log('\nResposta GET:', response.data);
  } catch (error) {
    console.error('\nErro no GET:', error.response ? error.response.data : error.message);
  }
};

const fazerPOST = async (cliente) => {
  try {
    const response = await axios.post(`${baseURL}/cadastro`, cliente);
    console.log('\nResposta POST:', response.data);
  } catch (error) {
    console.error('\nErro no POST:', error.response ? error.response.data : error.message);
  }
};

const fazerPUT = async (clienteAtualizado) => {
  const idPUT = '1';
  console.log(`Realizando PUT com ID: ${idPUT} e dados: ${JSON.stringify(clienteAtualizado)}`);
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

const fazerPATCH = async () => {
  const idPATCH = await capturarIdCliente();
  const clienteParcial = await capturarDadosCliente();

  console.log(`Realizando PATCH com ID: ${idPATCH} e dados: ${JSON.stringify(clienteParcial)}`);

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

const fazerDELETE = async (id) => {
  try {
    const response = await axios.delete(`${baseURL}/cliente/${id}`);
    console.log('\nResposta DELETE:', response.data);
  } catch (error) {
    console.error('\nErro no DELETE:', error.response ? error.response.data : error.message);
  }
};

const capturarEntrada = () => {
  return new Promise((resolve) => {
    rl.question('\nEscolha o método HTTP (GET, POST, PUT, PATCH, DELETE) ou digite "Sair" para encerrar: ', (metodo) => {
      resolve(metodo.toUpperCase().trim());
    });
  });
};

const capturarDadosCliente = () => {
  return new Promise((resolve) => {
    rl.question('Digite os dados do cliente (nome, idade, celular): ', (dados) => {
      const [nome, idade, celular] = dados.split(',');

      if (!nome || !idade || !celular || isNaN(parseInt(idade.trim())) || !/^\d{2}\d{9}$/.test(celular.trim())) {
        console.log('Dados inválidos! Certifique-se de digitar nome, idade e celular corretamente.');
        resolve(capturarDadosCliente());
      } else {
        resolve({ nome: nome.trim(), idade: parseInt(idade.trim()), celular: celular.trim() });
      }
    });
  });
};

const capturarIdCliente = () => {
  return new Promise((resolve) => {
    rl.question('Digite o ID do cliente: ', (id) => {
      if (isNaN(parseInt(id.trim()))) {
        console.log('ID inválido! O ID deve ser um número.');
        resolve(capturarIdCliente());
      } else {
        resolve(id.trim());
      }
    });
  });
};

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
        await fazerGET();
        break;

      case 'POST':
        const clientePOST = await capturarDadosCliente();
        await fazerPOST(clientePOST);
        break;

      case 'PUT':
        const clientePUT = await capturarDadosCliente();
        await fazerPUT(clientePUT);
        break;

      case 'PATCH':
        await fazerPATCH();
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

menuPrincipal();
