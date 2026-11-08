const { perguntarIA } = require("../src/aiService");

const respostaOk = (texto) => ({
  ok: true,
  json: async () => ({ candidates: [{ content: { parts: [{ text: texto }] } }] }),
});

describe("perguntarIA", () => {
  const ambienteOriginal = process.env;

  beforeEach(() => {
    process.env = { ...ambienteOriginal, GEMINI_API_KEY: "chave-falsa" };
    global.fetch = jest.fn();
  });
  afterAll(() => {
    process.env = ambienteOriginal;
  });

  it("retorna o texto da IA e usa a chave no cabeçalho", async () => {
    global.fetch.mockResolvedValue(respostaOk("Olá!"));
    const texto = await perguntarIA("Oi");
    expect(texto).toBe("Olá!");
    const [url, opcoes] = global.fetch.mock.calls[0];
    expect(url).toContain("gemini-3.8-flash");
    expect(url).not.toContain("chave-falsa");
    expect(opcoes.headers["x-goog-api-key"]).toBe("chave-falsa");
  });

  it("respeita o modelo definido em GEMINI_MODEL", async () => {
    process.env.GEMINI_MODEL = "outro-modelo";
    global.fetch.mockResolvedValue(respostaOk("ok"));
    await perguntarIA("Oi");
    expect(global.fetch.mock.calls[0][0]).toContain("outro-modelo");
  });

  it("falha sem chave de API", async () => {
    delete process.env.GEMINI_API_KEY;
    await expect(perguntarIA("Oi")).rejects.toMatchObject({ status: 500 });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("falha quando a API responde com erro HTTP", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ error: { message: "Limite de requisições excedido." } }),
    });
    await expect(perguntarIA("Oi")).rejects.toThrow(
      "A IA retornou erro 429: Limite de requisições excedido.",
    );
  });

  it("falha quando a resposta vem vazia", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ candidates: [] }) });
    await expect(perguntarIA("Oi")).rejects.toThrow("não devolveu");
  });
});
