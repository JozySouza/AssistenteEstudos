const formulario = document.getElementById("formulario");
const campo = document.getElementById("pergunta");
const botao = document.getElementById("botao");
const contador = document.getElementById("contador");
const resultado = document.getElementById("resultado");
const resposta = document.getElementById("resposta");

const API_URL = window.API_URL || "";

function mostrar(texto, ehErro = false) {
  resultado.hidden = false;
  resultado.classList.toggle("erro", ehErro);
  resposta.textContent = texto;
}

campo.addEventListener("input", () => {
  contador.textContent = `${campo.value.length}/500`;
});

campo.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") formulario.requestSubmit();
});

document.querySelectorAll(".exemplo").forEach((b) =>
  b.addEventListener("click", () => {
    campo.value = b.textContent;
    campo.dispatchEvent(new Event("input"));
    campo.focus();
  })
);

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  const pergunta = campo.value.trim();
  if (!pergunta) return;

  botao.disabled = true;
  botao.textContent = "Pensando...";
  mostrar("Buscando a resposta...");

  try {
    const res = await fetch(`${API_URL}/perguntar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta }),
    });
    const dados = await res.json();
    if (!res.ok) throw new Error(dados.erro || "Erro inesperado.");
    mostrar(dados.resposta);
  } catch (erro) {
    mostrar(`${erro.message} Tente novamente em instantes.`, true);
  } finally {
    botao.disabled = false;
    botao.textContent = "Perguntar";
  }
});
