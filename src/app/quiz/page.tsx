"use client";
import { useState } from "react";

export default function QuizPage() {
  const [syllabus, setSyllabus] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    setQuizData(null);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syllabus, numQuestions }),
      });

      if (!res.ok) throw new Error("Failed to fetch quiz");

      const data = await res.json();
      setQuizData(data);
    } catch (err) {
      console.error("Error generating quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generate Quiz</h1>

      <input
        type="text"
        placeholder="Enter syllabus (e.g. JavaScript)"
        value={syllabus}
        onChange={(e) => setSyllabus(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <input
        type="number"
        placeholder="Number of Questions"
        value={numQuestions}
        onChange={(e) => setNumQuestions(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <button
        onClick={generateQuiz}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Quiz"}
      </button>

      {quizData && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Quiz:</h2>
          <pre className="bg-gray-100 p-3 rounded">
            {JSON.stringify(quizData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
