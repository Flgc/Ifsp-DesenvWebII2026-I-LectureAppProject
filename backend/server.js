const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes =
    require("./routes/auth.routes");

const palestraRoutes =
require("./routes/palestra.routes");    

const inscricaoRoutes =
require("./routes/inscricao.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
    "/api",
    authRoutes
);

app.use(
    "/api",
    palestraRoutes
);

app.use(
    "/api",
    inscricaoRoutes
);

app.get("/", (req, res) => {
  res.json({
    sistema: "Sistema de Palestras 2026-06",
    status: "online"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Servidor executando na porta ${PORT}`
  );
});
