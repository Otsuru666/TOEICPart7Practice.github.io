import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';

async function getProblems() {
    const problemsDir = path.join(process.cwd(), 'TOEIC', '問題');
    if (!fs.existsSync(problemsDir)) {
        return [];
    }
    const files = fs.readdirSync(problemsDir);
    return files.filter(file => file.endsWith('.json'));
}

export default async function Part7ListPage() {
    const problems = await getProblems();

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">TOEIC Part 7 Practice</h1>
                    <p className="text-slate-600">Select a problem to start practicing.</p>
                </header>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {problems.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                            <p className="text-slate-500">No problems found.</p>
                            <p className="text-sm text-slate-400 mt-2">
                                Generate a problem JSON and save it to <code>TOEIC/問題</code>
                            </p>
                        </div>
                    ) : (
                        problems.map((file) => (
                            <Link
                                key={file}
                                href={`/part7/${file.replace('.json', '')}`}
                                className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                                        <FileText size={24} />
                                    </div>
                                    <ChevronRight className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <h2 className="text-lg font-semibold text-slate-800 mb-1 truncate">
                                    {file.replace('.json', '')}
                                </h2>
                                <p className="text-sm text-slate-500 mt-auto pt-4 border-t border-slate-50">
                                    Click to start practice
                                </p>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
