const INSTRUCAO_SISTEMA =
  "Você é um assistente de estudos para estudantes universitários. " +
  "Responda em português do Brasil, de forma clara, didática e objetiva, " +
  "com no máximo 3 parágrafos curtos. Se fizer sentido, dê um exemplo simples.";

class ErroIA extends Error {
  constructor(mensagem, status = 502) {
    super(mensagem);
    this.name = "ErroIA";
    this.status = status;
  }
}

async function perguntarIA(pergunta) {
  const chave = process.env.GEMINI_API_KEY;
  if (!chave) {
    throw new ErroIA("GEMINI_API_KEY não configurada no servidor.", 500);
  }

  const modelo = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`;

  const resposta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": chave },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: INSTRUCAO_SISTEMA }] },
      contents: [{ role: "user", parts: [{ text: pergunta }] }],
    }),
  });

  if (!resposta.ok) {
    let detalheErro = "";
    try {
      const dadosErro = await resposta.json();
      detalheErro = dadosErro?.error?.message || "";
    } catch (erroLeitura) {
      if (!(erroLeitura instanceof SyntaxError)) {
        throw erroLeitura;
      }
    }

    const mensagem = detalheErro
      ? `A IA retornou erro ${resposta.status}: ${detalheErro}`
      : `A IA retornou erro ${resposta.status}.`;
    throw new ErroIA(mensagem);
  }

  const dados = await resposta.json();
  const partes = dados?.candidates?.[0]?.content?.parts;
  const texto = Array.isArray(partes) ? partes.map((p) => p.text || "").join("").trim() : "";

  if (!texto) {
    throw new ErroIA("A IA não devolveu uma resposta.");
  }
  return texto;
}

module.exports = { perguntarIA, ErroIA };
