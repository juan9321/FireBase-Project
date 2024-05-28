// Importa o módulo express para criar o servidor web..
const express = require("express");

// Cria uma aplicação Express.
const app = express();

// Importa o módulo handlebars para renderização de templates.
const handlebars = require("express-handlebars").engine;

// Importa helpers adicionais para handlebars.
const helpers = require("handlebars-helpers")();

// Importa o body-parser para processar dados enviados via POST.
const bodyParser = require("body-parser");

// Importa funções do Firebase Admin SDK para inicializar o app e acessar o Firestore.
const {
  initializeApp,
  cert,
} = require("firebase-admin/app");

const {
  getFirestore,
} = require("firebase-admin/firestore");

// Carrega as credenciais do Firebase a partir de um arquivo JSON.
const serviceAccount = require("./Banco.json");

// Inicializa o app Firebase com as credenciais fornecidas.
initializeApp({
  credential: cert(serviceAccount),
});

// Inicializa o Firestore para interações com o banco de dados.
const db = getFirestore();

// Configura o motor de templates handlebars com layout padrão e helpers.
app.engine("handlebars", handlebars({ defaultLayout: "main", helpers: helpers }));

// Define handlebars como o motor de visualização padrão.
app.set("view engine", "handlebars");

// Configura o body-parser para processar requisições URL-encoded e JSON.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define rota para a página inicial, renderizando 'primeira_pagina' com handlebars.
app.route("/")
  .get((req, res) => {
    res.render("primeira_pagina");
  });

// Define rota para consultar documentos do Firestore e renderizar 'consulta' com os dados obtidos.
app.route("/consulta")
  .get(async (req, res) => {
    const dataSnapshot = await db.collection('agendamentos').get();
    const data = [];
    dataSnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        nome: doc.get('nome'),
        telefone: doc.get('telefone'),
        origem: doc.get('origem'),
        data_contato: doc.get('data_contato'),
        observacao: doc.get('observacao'),
      });
    });
    res.render("consulta", { data });
  });

// Define rota para editar um documento específico, renderizando 'editar' com os dados do documento.
app.route("/editar/:id")
  .get(async (req, res) => {
    const dataSnapshot = await db.collection('agendamentos').doc(req.params.id).get();
    const data = {
      id: dataSnapshot.id,
      nome: dataSnapshot.get('nome'),
      telefone: dataSnapshot.get('telefone'),
      origem: dataSnapshot.get('origem'),
      data_contato: dataSnapshot.get('data_contato'),
      observacao: dataSnapshot.get('observacao'),
    };

    res.render("editar", { data });
  });

// Define rota para excluir um documento específico e redirecionar para '/consulta' após a exclusão.
app.route("/excluir/:id")
  .get((req, res) => {
    db.collection('agendamentos').doc(req.params.id).delete().then(() => {
      console.log('Documento excluído com sucesso.');
      res.redirect('/consulta');
    }).catch((error) => {
      console.error('Erro ao excluir o documento: ', error);
      res.status(500).send('Erro ao excluir o documento.');
    });
  });

// Define rota para cadastrar um novo documento no Firestore a partir de dados enviados via POST.
app.route("/cadastrar")
  .post((req, res) => {
    db.collection("agendamentos").add({
      nome: req.body.nome,
      telefone: req.body.telefone,
      origem: req.body.origem,
      data_contato: req.body.data_contato,
      observacao: req.body.observacao,
    }).then(() => {
      console.log("Documento cadastrado com sucesso.");
      res.redirect("/");
    }).catch((error) => {
      console.error('Erro ao cadastrar o documento: ', error);
      res.status(500).send('Erro ao cadastrar o documento.');
    });
  });

// Define rota para atualizar um documento existente no Firestore a partir de dados enviados via POST.
app.route("/atualizar")
  .post((req, res) => {
    db.collection("agendamentos").doc(req.body.id).update({
      nome: req.body.nome,
      telefone: req.body.telefone,
      origem: req.body.origem,
      data_contato: req.body.data_contato,
      observacao: req.body.observacao,
    }).then(() => {
      console.log("Documento atualizado com sucesso.");
      res.redirect("/consulta");
    }).catch((error) => {
      console.error('Erro ao atualizar o documento: ', error);
      res.status(500).send('Erro ao atualizar o documento.');
    });
  });

// Inicia o servidor na porta 8081 e imprime mensagem no console.
app.listen(8081, () => {
  console.log("Servidor ativo na porta 8081!");
});
