const express = require('express');
const mercadopago = require('mercadopago');

const app = express();
const port = 3000;

// Configuração do Mercado Pago
mercadopago.configure({
  access_token: 'APP_USR-e0e0d6bf-b9d1-43a2-a80e-7f36059ce617', // Substitua pelo seu token de acesso
});

// Middleware para processamento de JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota para criar preferência de pagamento
app.post('/create_preference', async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: req.body.title,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: parseFloat(req.body.price),
        },
      ],
      back_urls: {
        success: 'http://localhost:3000/success',
        failure: 'http://localhost:3000/failure',
        pending: 'http://localhost:3000/pending',
      },
      auto_return: 'approved',
    };

    // Criação da preferência
    const response = await mercadopago.preferences.create(preference);
    res.json(response);
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    res.status(500).send('Erro ao criar preferência');
  }
});

// Rota para a página de sucesso
app.get('/success', (req, res) => {
  res.send('Pagamento realizado com sucesso!');
});

// Rota para a página de falha
app.get('/failure', (req, res) => {
  res.send('O pagamento falhou.');
});

// Rota para a página de pendência
app.get('/pending', (req, res) => {
  res.send('Pagamento pendente.');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
