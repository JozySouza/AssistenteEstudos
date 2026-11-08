const path = require("path");
const express = require("express");
const cors = require("cors");
const { perguntarIA } = require("./aiService");

const LIMITE_PERGUNTA = 500;

const app = express();
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Interface web (pasta /frontend) servida pelo próprio backend
app.use(express.static(path.join(__dirname, "..", "..", "frontend")));

app.get("/saude", (req, res) => {
  res.json({ status: "ok", horario: new Date().toISOString() });
});

app.post("/perguntar", async (req, res) => {
  const { pergunta } = req.body || {};

  if (typeof pergunta !== "string" || pergunta.trim() === "") {
    return res.status(400).json({ erro: "Envie uma pergunta em texto." });
  }
  if (pergunta.length > LIMITE_PERGUNTA) {
    return res
      .status(400)
      .json({ erro: `A pergunta deve ter no máximo ${LIMITE_PERGUNTA} caracteres.` });
  }

  try {
    const resposta = await perguntarIA(pergunta.trim());
    res.json({ resposta });
  } catch (erro) {
    console.error("Falha ao consultar a IA:", erro.message);
    res.status(erro.status || 502).json({ erro: "Não foi possível obter a resposta da IA agora." });
  }
});

module.exports = app;
