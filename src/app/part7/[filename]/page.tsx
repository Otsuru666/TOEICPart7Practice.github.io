import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import QuizClient from '../QuizClient';

interface PageProps {
    params: Promise<{ filename: string }>;
}

async function getData(filename: string) {
    const filePath = path.join(process.cwd(), 'TOEIC', '問題', `${filename}.json`);
    if (!fs.existsSync(filePath)) {
        return null;
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    try {
        return JSON.parse(fileContents);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
    }
}

export async function generateStaticParams() {
    const problemsDir = path.join(process.cwd(), 'TOEIC', '問題');
    if (!fs.existsSync(problemsDir)) {
        return [];
    }
    const files = fs.readdirSync(problemsDir);
    return files
        .filter((file) => file.endsWith('.json'))
        .map((file) => ({
            filename: file.replace('.json', ''),
        }));
}

export default async function Part7ProblemPage({ params }: PageProps) {
    const { filename } = await params;
    const quizData = await getData(filename);

    if (!quizData) {
        notFound();
    }

    return <QuizClient initialData={quizData} />;
}
