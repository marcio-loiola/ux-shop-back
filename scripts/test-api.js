const axios = require('axios');

const baseURL = 'http://localhost:3000/api';

async function testAPI() {
  try {
    console.log('Testando endpoint de saúde...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('Resposta /health:', healthResponse.data);

    console.log('Testando listagem de produtos...');
    const productsResponse = await axios.get(`${baseURL}/products`);
    console.log('Resposta /products:', productsResponse.data);

    console.log('Testando login (ajuste credenciais se necessário)...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'user@example.com',
      password: 'password123',
    });
    console.log('Resposta /auth/login:', loginResponse.data);

    console.log('Todos os testes passaram!');
  } catch (error) {
    console.error(
      'Erro no teste:',
      error.response ? error.response.data : error.message,
    );
  }
}

testAPI();
