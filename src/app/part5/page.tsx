"use client";

import { useState } from "react";

interface QuizData {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
}

export default function Part5Page() {
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchQuiz = async () => {
        setLoading(true);
        setError(null);
        setQuiz(null);
        setSelectedAnswer(null);
        setShowResult(false);

        try {
            const res = await fetch("/api/quiz", { method: "POST" });
            if (!res.ok) {
                throw new Error("Failed to fetch quiz");
            }
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setQuiz(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleOptionClick = (option: string) => {
        if (showResult) return;
        setSelectedAnswer(option);
        setShowResult(true);
    };

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">

                {/* Header */}
                <div className="bg-blue-600 p-6 text-center">
                    <h1 className="text-3xl font-bold text-white tracking-tight">TOEIC Part 5 Practice</h1>
                    <p className="text-blue-100 mt-2">Grammar & Vocabulary Challenge</p>
                </div>

                <div className="p-8">
                    {/* Initial State / Generate Button */}
                    {!quiz && !loading && !error && (
                        <div className="text-center py-10">
                            <p className="text-lg text-slate-600 mb-8">
                                Ready to test your skills? Generate a new AI-powered question.
                            </p>
                            <button
                                onClick={fetchQuiz}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-200 transform hover:-translate-y-1"
                            >
                                Generate Question
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-slate-500 animate-pulse">Generating question...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="text-center py-8">
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
                                {error}
                            </div>
                            <button
                                onClick={fetchQuiz}
                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Quiz Display */}
                    {quiz && !loading && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Question */}
                            <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-blue-500">
                                <h2 className="text-xl font-medium leading-relaxed text-slate-800">
                                    {quiz.question}
                                </h2>
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {quiz.options.map((option, index) => {
                                    let buttonClass = "p-4 rounded-xl border-2 text-left transition-all duration-200 font-medium ";

                                    if (showResult) {
                                        if (option === quiz.answer) {
                                            buttonClass += "bg-green-50 border-green-500 text-green-700";
                                        } else if (option === selectedAnswer) {
                                            buttonClass += "bg-red-50 border-red-500 text-red-700";
                                        } else {
                                            buttonClass += "bg-white border-slate-200 text-slate-400 opacity-60";
                                        }
                                    } else {
                                        buttonClass += "bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md cursor-pointer text-slate-700";
                                    }

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleOptionClick(option)}
                                            disabled={showResult}
                                            className={buttonClass}
                                        >
                                            <span className="inline-block w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center mr-3 border border-slate-200">
                                                {String.fromCharCode(65 + index)}
                                            </span>
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Result & Explanation */}
                            {showResult && (
                                <div className="mt-8 pt-6 border-t border-slate-100 animate-in fade-in duration-500">
                                    <div className={`text-center mb-6 ${selectedAnswer === quiz.answer ? "text-green-600" : "text-red-500"}`}>
                                        <span className="text-2xl font-bold">
                                            {selectedAnswer === quiz.answer ? "Correct! 🎉" : "Incorrect"}
                                        </span>
                                    </div>

                                    <div className="bg-blue-50 p-6 rounded-xl">
                                        <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">Explanation</h3>
                                        <p className="text-slate-700 leading-relaxed">
                                            {quiz.explanation}
                                        </p>
                                    </div>

                                    <div className="mt-8 text-center">
                                        <button
                                            onClick={fetchQuiz}
                                            className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg"
                                        >
                                            Next Question
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
                    Powered by Google Gemini
                </div>
            </div>
        </main>
    );
}
