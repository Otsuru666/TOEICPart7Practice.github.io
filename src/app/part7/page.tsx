"use client";

import React, { useState, useMemo } from 'react';
import { BookOpen, HelpCircle, CheckCircle, XCircle, Award, Loader2 } from 'lucide-react';

// Define types for our data structure
interface MetaItem {
    label: string;
    value: string;
}

interface ContentBlock {
    type: 'paragraph' | 'table' | 'kv-list';
    text?: string;
    headers?: string[];
    rows?: string[][];
    items?: { label: string; value: string; highlight?: boolean }[];
}

interface Passage {
    title: string;
    meta: MetaItem[];
    content: ContentBlock[];
}

interface Option {
    id: string;
    text: string;
}

interface Question {
    id: number;
    text: string;
    correct: string;
    explanation: string;
    options: Option[];
}

interface QuizData {
    passage: Passage;
    questions: Question[];
}

export default function Part7Page() {
    // ------------------------------------------------
    // State Management
    // ------------------------------------------------
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [isChecked, setIsChecked] = useState(false);
    const [activeTab, setActiveTab] = useState<'passage' | 'questions'>('passage');

    // ------------------------------------------------
    // Logic
    // ------------------------------------------------
    const fetchQuiz = async () => {
        setLoading(true);
        setError(null);
        setQuizData(null);
        setUserAnswers({});
        setIsChecked(false);
        setActiveTab('passage');

        try {
            const res = await fetch("/api/part7", { method: "POST" });
            if (!res.ok) {
                throw new Error("Failed to fetch quiz");
            }
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setQuizData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (qId: number, optionId: string) => {
        if (isChecked) return;
        setUserAnswers(prev => ({ ...prev, [qId]: optionId }));
    };

    const handleCheck = () => {
        if (!quizData) return;
        const answeredCount = Object.keys(userAnswers).length;
        if (answeredCount < quizData.questions.length) {
            if (!confirm(`${quizData.questions.length}問中${answeredCount}問しか回答していません。採点しますか？`)) {
                return;
            }
        }
        setIsChecked(true);
        if (window.innerWidth < 768) {
            setActiveTab('questions');
        }
    };

    const handleRetry = () => {
        setUserAnswers({});
        setIsChecked(false);
        setActiveTab('passage');
        window.scrollTo(0, 0);
    };

    const score = useMemo(() => {
        if (!quizData) return 0;
        let count = 0;
        quizData.questions.forEach(q => {
            if (userAnswers[q.id] === q.correct) count++;
        });
        return count;
    }, [userAnswers, isChecked, quizData]);

    // ------------------------------------------------
    // UI Helpers
    // ------------------------------------------------
    const renderContentBlock = (block: ContentBlock, idx: number) => {
        if (block.type === 'paragraph') {
            return (
                <p key={idx} className="mb-6 whitespace-pre-line text-gray-700 leading-relaxed">
                    {block.text}
                </p>
            );
        }

        if (block.type === 'table' && block.headers && block.rows) {
            return (
                <div key={idx} className="mb-6 overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-xs">
                            <tr>
                                {block.headers.map((h, i) => (
                                    <th key={i} className={`px-4 py-3 ${i > 0 ? 'text-center' : ''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {block.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="bg-white hover:bg-gray-50">
                                    {row.map((cell, cIdx) => (
                                        <td key={cIdx} className={`px-4 py-3 text-gray-700 ${cIdx > 0 ? 'text-center font-mono' : 'font-medium'}`}>
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        if (block.type === 'kv-list' && block.items) {
            return (
                <div key={idx} className="mb-6 flex flex-col items-end space-y-1">
                    {block.items.map((item, i) => (
                        <div key={i} className={`flex w-full max-w-xs justify-between px-4 py-2 rounded ${item.highlight ? 'bg-indigo-50 text-indigo-900 font-bold text-lg border border-indigo-100' : 'text-gray-600'}`}>
                            <span className="font-medium">{item.label}:</span>
                            <span className="font-mono">{item.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    // ------------------------------------------------
    // Main Render
    // ------------------------------------------------
    return (
        <div className="flex flex-col h-screen bg-gray-100 text-gray-800 font-sans overflow-hidden">

            {/* Header */}
            <header className="flex-none h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-8 shadow-sm z-10 justify-between">
                <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
                    <BookOpen size={24} />
                    <span>TOEIC Part 7 Practice</span>
                </h1>

                <div className="flex items-center gap-4">
                    {!quizData && !loading && (
                        <button
                            onClick={fetchQuiz}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
                        >
                            Generate New Problem
                        </button>
                    )}

                    {isChecked && quizData && (
                        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
                            <Award className="text-indigo-600" size={18} />
                            <span className="font-bold text-indigo-800">Score: {score} / {quizData.questions.length}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Loading State */}
            {loading && (
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
                    <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium animate-pulse">Generating Part 7 problem...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-4">
                    <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 max-w-md text-center">
                        <p className="font-bold mb-2">Error</p>
                        <p className="mb-4">{error}</p>
                        <button
                            onClick={fetchQuiz}
                            className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* Initial State */}
            {!quizData && !loading && !error && (
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
                    <div className="max-w-md">
                        <BookOpen className="h-16 w-16 text-indigo-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Ready to Practice?</h2>
                        <p className="text-gray-600 mb-8">
                            Generate a realistic TOEIC Part 7 reading comprehension problem powered by AI.
                        </p>
                        <button
                            onClick={fetchQuiz}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:-translate-y-1"
                        >
                            Start Practice
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Area - Split View Logic */}
            {quizData && !loading && (
                <main className="flex-1 flex overflow-hidden relative">

                    {/* Left Panel: Passage */}
                    <div
                        className={`
              flex-col overflow-y-auto bg-white border-r border-gray-200 transition-all duration-300
              md:flex md:w-[55%] 
              ${activeTab === 'passage' ? 'flex w-full absolute inset-0 z-10 md:static' : 'hidden'}
            `}
                    >
                        <div className="max-w-3xl mx-auto p-6 md:p-10">
                            {/* Meta Header */}
                            {quizData.passage.meta && quizData.passage.meta.length > 0 && (
                                <div className="mb-8 pb-4 border-b border-dashed border-gray-300 text-sm space-y-2 text-gray-700 font-medium bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    {quizData.passage.meta.map((item, idx) => (
                                        <div key={idx} className="grid grid-cols-[80px_1fr] gap-2">
                                            <span className="text-gray-500 font-bold text-right">{item.label}:</span>
                                            <span className="text-gray-900 font-mono break-words">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Body Content with Dynamic Rendering */}
                            <div className="font-serif text-lg">
                                {quizData.passage.content.map((block, idx) => renderContentBlock(block, idx))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Questions */}
                    <div
                        className={`
              flex-col overflow-y-auto bg-gray-50 
              md:flex md:w-[45%]
              ${activeTab === 'questions' ? 'flex w-full absolute inset-0 z-10 md:static' : 'hidden'}
            `}
                    >
                        <div className="p-4 md:p-8 pb-24 md:pb-8">
                            {quizData.questions.map((q) => {
                                const isCorrect = userAnswers[q.id] === q.correct;
                                const userAnswer = userAnswers[q.id];

                                return (
                                    <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6 transition-all hover:shadow-md">
                                        {/* Question Text */}
                                        <h3 className="font-bold text-lg mb-4 text-gray-800 flex gap-3">
                                            <span className="text-indigo-500 min-w-[1.5rem]">{q.id}.</span>
                                            <span>{q.text}</span>
                                        </h3>

                                        {/* Options */}
                                        <div className="space-y-2">
                                            {q.options.map((opt) => {
                                                let stateClass = "border-gray-200 hover:bg-gray-50 hover:border-indigo-300";
                                                let icon = null;

                                                if (isChecked) {
                                                    if (opt.id === q.correct) {
                                                        stateClass = "bg-green-50 border-green-500 text-green-800 font-medium";
                                                        icon = <CheckCircle size={18} className="text-green-600" />;
                                                    } else if (userAnswer === opt.id && opt.id !== q.correct) {
                                                        stateClass = "bg-red-50 border-red-400 text-red-800";
                                                        icon = <XCircle size={18} className="text-red-500" />;
                                                    } else {
                                                        stateClass = "opacity-50 border-gray-100";
                                                    }
                                                } else {
                                                    if (userAnswer === opt.id) {
                                                        stateClass = "bg-indigo-50 border-indigo-500 text-indigo-700 font-medium ring-1 ring-indigo-500";
                                                    }
                                                }

                                                return (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => handleSelect(q.id, opt.id)}
                                                        disabled={isChecked}
                                                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between group ${stateClass}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 ${userAnswer === opt.id || (isChecked && opt.id === q.correct) ? 'bg-white bg-opacity-50' : 'bg-gray-100 text-gray-500'}`}>
                                                                {opt.id}
                                                            </span>
                                                            <span>{opt.text}</span>
                                                        </div>
                                                        {icon}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Explanation Section */}
                                        {isChecked && (
                                            <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-500">
                                                <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-900 border-l-4 border-blue-500">
                                                    <div className="font-bold mb-1 flex items-center gap-2">
                                                        <HelpCircle size={16} /> 解説
                                                    </div>
                                                    {q.explanation}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Action Button */}
                            <div className="mt-8">
                                {!isChecked ? (
                                    <button
                                        onClick={handleCheck}
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-transform transform active:scale-95"
                                    >
                                        Check Answers
                                    </button>
                                ) : (
                                    <button
                                        onClick={fetchQuiz}
                                        className="w-full py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-bold text-lg shadow-lg transition-transform transform active:scale-95"
                                    >
                                        Generate Next Problem
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            )}

            {/* Mobile Navigation Bar */}
            {quizData && !loading && (
                <nav className="md:hidden flex-none h-16 bg-white border-t border-gray-200 flex justify-around items-center z-20 pb-safe">
                    <button
                        onClick={() => setActiveTab('passage')}
                        className={`flex flex-col items-center justify-center w-1/2 h-full transition-colors ${activeTab === 'passage' ? 'text-indigo-600 border-t-2 border-indigo-600 bg-indigo-50' : 'text-gray-400'}`}
                    >
                        <span className="text-xl">📄</span>
                        <span className="text-xs font-medium mt-1">Passage</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`flex flex-col items-center justify-center w-1/2 h-full transition-colors ${activeTab === 'questions' ? 'text-indigo-600 border-t-2 border-indigo-600 bg-indigo-50' : 'text-gray-400'}`}
                    >
                        <span className="text-xl">❓</span>
                        <span className="text-xs font-medium mt-1">Questions</span>
                    </button>
                </nav>
            )}

        </div>
    );
}
