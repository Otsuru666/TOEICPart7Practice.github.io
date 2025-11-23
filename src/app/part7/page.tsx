import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { FileText, ChevronRight, ArrowLeft, Archive } from 'lucide-react';

async function getProblems() {
    const problemsDir = path.join(process.cwd(), 'TOEIC', '問題');
    if (!fs.existsSync(problemsDir)) {
        return [];
    }
    const files = fs.readdirSync(problemsDir);
    return files
        .filter(file => file.endsWith('.json'))
        .map(file => {
            const filePath = path.join(problemsDir, file);
            const stats = fs.statSync(filePath);
            return {
                filename: file.replace('.json', ''),
                mtime: stats.mtime
            };
        })
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
}

export default async function Part7ArchivePage() {
    const problems = await getProblems();

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Archive size={20} className="text-indigo-600" />
                        Past Problems
                    </h1>
                    <div className="w-20"></div> {/* Spacer for centering */}
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Problem Archive</h2>
                    <p className="text-slate-500">Review and practice with previous reading comprehension challenges.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {problems.length === 0 ? (
                        <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <FileText size={32} />
                            </div>
                            <p className="text-lg font-medium text-slate-600">No problems found.</p>
                            <p className="text-slate-400 mt-2">
                                Generate a problem JSON and save it to <code>TOEIC/問題</code>
                            </p>
                        </div>
                    ) : (
                        problems.map((problem) => (
                            <Link
                                key={problem.filename}
                                href={`/part7/${problem.filename}`}
                                className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                                        <FileText size={24} />
                                    </div>
                                    <ChevronRight className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">
                                    {problem.filename}
                                </h3>
                                <p className="text-xs text-slate-400 font-mono mb-4">
                                    {problem.mtime.toLocaleDateString()}
                                </p>
                                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center text-sm text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    Start Practice <ChevronRight size={16} className="ml-1" />
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
