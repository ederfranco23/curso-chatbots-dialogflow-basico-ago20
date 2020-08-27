const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios")
const app = express();
app.use(bodyParser.json());


app.get("/webhook", (request, response) => {
  response.json({ fulfillmentText: "CHEGOU NA API."});
});


app.post("/webhook", (request, response) => {
  console.log("request.body", request.body);
  const intent = request.body.queryResult.intent.displayName;
  
  if(intent === 'login') {
      const { email, password } = request.body.queryResult.parameters;
      //response.json({ fulfillmentText: `Logando com ${email} e ${password}` });
      
      axios.post("https://reqres.in/api/login", {email, password}).then(apiRes => {
          console.log(apiRes);
          response.json({ fulfillmentText: `Deu certo! Você está logado! (${apiRes.data.token})` });
      }).catch(error => {
          response.json({ fulfillmentText: 'Dados de acesso inválidos.' });
      });
  } else if(intent === 'listar-usuarios') {
      axios.get("https://reqres.in/api/users/2").then(apiRes => {
          console.log(apiRes);
          const nome = `${apiRes.data.data.first_name} ${apiRes.data.data.last_name}`;
           response.json({ fulfillmentText: `Você conhece a ${nome}?` });
      }).catch(error => {
          response.json({ fulfillmentText: 'Dados de acesso inválidos.' });
      });
  } else {
      response.json({ fulfillmentText: 'Poxa! Não sei como te ajudar...' });
  }

});

// listen for requests :)
const listener = app.listen(8888, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
