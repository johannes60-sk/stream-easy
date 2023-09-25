const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use(morgan("dev"));

// Middleware pour traiter les requêtes POST avec des données JSON
app.use(express.json({ type: 'application/json' }));

// Middleware pour autoriser les requêtes cross-domain
const corsOptions = {
  origin: '*',
  credentials: true
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



const jsonRouter = require('./routes/JsonRoute');


app.use('/api', jsonRouter);

app.listen(3005, () => {
  console.log('Serveur démarré sur le port 3005');
});
