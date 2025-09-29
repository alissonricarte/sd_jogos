import React, { useState, useEffect } from "react";

const QUESTIONS = [
  {
    id: 1,
    ods: "ODS 1",
    question: "Qual é o foco principal do ODS 1?",
    options: [
      "Erradicação da pobreza",
      "Boa saúde e bem-estar",
      "Educação de qualidade",
      "Ação contra a mudança do clima",
    ],
    answerIndex: 0,
    hint: "Pobreza zero.",
  },
  {
    id: 2,
    ods: "ODS 4",
    question: "O que o ODS 4 promove?",
    options: ["Energia limpa", "Vida terrestre", "Educação de qualidade", "Indústria"],
    answerIndex: 2,
    hint: "Aprender para transformar.",
  },
  {
    id: 3,
    ods: "ODS 13",
    question: "ODS 13 está relacionado com:",
    options: ["Ação climática", "Igualdade de gênero", "Água potável", "Cidades sustentáveis"],
    answerIndex: 0,
    hint: "Emergência global: reduzir riscos climáticos.",
  },
];

function ProgressBar({ value, max }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div aria-hidden style={{ background: "#eee", height: 10, borderRadius: 6 }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          borderRadius: 6,
          transition: "width 400ms ease",
          background: "linear-gradient(90deg,#16a34a,#60a5fa)",
        }}
      />
    </div>
  );
}

export default function App() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = QUESTIONS[index];

  useEffect(() => {
    setSelected(null);
    setShowHint(false);
  }, [index]);

  function chooseOption(i) {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === q.answerIndex;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      const next = index + 1;
      if (next >= QUESTIONS.length) {
        setFinished(true);
      } else {
        setIndex(next);
      }
    }, 700);
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setFinished(false);
  }

  return (
    <main style={{ fontFamily: "Inter, sans-serif", padding: 20, maxWidth: 760, margin: "30px auto" }}>
      <header style={{ marginBottom: 18 }}>
        <h1>ODS — Quiz Interativo</h1>
        <p>Teste seus conhecimentos sobre os Objetivos de Desenvolvimento Sustentável.</p>
      </header>

      <section style={{ marginBottom: 12 }}>
        <ProgressBar value={index} max={QUESTIONS.length} />
      </section>

      {!finished ? (
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <strong>{q.ods}</strong>
            <div>{score} pts</div>
          </div>

          <article style={{ background: "white", borderRadius: 12, padding: 16 }}>
            <h2>{q.question}</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = selected !== null && i === q.answerIndex;
                const bg = selected === null ? "#F9FAFB" : isCorrect ? "#bbf7d0" : isSelected ? "#fecaca" : "#F3F4F6";
                return (
                  <li key={i} style={{ marginBottom: 8 }}>
                    <button
                      onClick={() => chooseOption(i)}
                      disabled={selected !== null}
                      style={{ width: "100%", padding: 12, borderRadius: 8, background: bg }}
                    >
                      {opt}
                    </button>
                  </li>
                );
              })}
            </ul>
            <button onClick={() => setShowHint((s) => !s)} style={{ marginTop: 10 }}>
              {showHint ? "Ocultar dica" : "Mostrar dica"}
            </button>
            {showHint && <p style={{ marginTop: 8 }}>{q.hint}</p>}
          </article>
        </section>
      ) : (
        <section style={{ textAlign: "center" }}>
          <h2>Fim de jogo!</h2>
          <p>Você marcou {score} de {QUESTIONS.length}.</p>
          <button onClick={restart}>Jogar novamente</button>
        </section>
      )}
    </main>
  );
}