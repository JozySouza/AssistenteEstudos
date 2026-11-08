const request = require("supertest");

jest.mock("../src/aiService");
const { perguntarIA, ErroIA } = require("../src/aiService");
const app = require("../src/app");

describe("GET /saude", () => {
  it("retorna status ok", async () => {
    const res = await request(app).get("/saude");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("POST /perguntar", () => {
  beforeEach(() => jest.clearAllMocks());

  it("devolve a resposta da IA (mock)", async () => {
    perguntarIA.mockResolvedValue("Resposta simulada");
    const res = await request(app).post("/perguntar").send({ pergunta: "  O que é HTTP? " });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ resposta: "Resposta simulada" });
    expect(perguntarIA).toHaveBeenCalledWith("O que é HTTP?");
  });

  it("rejeita pergunta vazia", async () => {
    const res = await request(app).post("/perguntar").send({ pergunta: "   " });
    expect(res.status).toBe(400);
    expect(perguntarIA).not.toHaveBeenCalled();
  });

  it("rejeita corpo sem pergunta ou com tipo errado", async () => {
    const res = await request(app).post("/perguntar").send({ pergunta: 123 });
    expect(res.status).toBe(400);
  });

  it("rejeita pergunta muito longa", async () => {
    const res = await request(app).post("/perguntar").send({ pergunta: "a".repeat(501) });
    expect(res.status).toBe(400);
  });

  it("retorna 502 quando a IA falha", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    perguntarIA.mockRejectedValue(new ErroIA("falhou", 502));
    const res = await request(app).post("/perguntar").send({ pergunta: "Oi" });
    expect(res.status).toBe(502);
    expect(res.body.erro).toBeDefined();
  });
});
