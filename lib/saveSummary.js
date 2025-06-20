import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { stripMarkdown } from './markdownParser.js';

export const saveSummary = (summary, format = 'md') => {
    const cleanFormat = format.toLowerCase();
    const ext = ['md', 'txt', 'json'].includes(cleanFormat) ? cleanFormat : 'md';
    const summariesDir = path.join(process.cwd(), 'summaries');
    const filePath = path.join(summariesDir, `summary_${new Date().getTime()}.${ext}`);

    let content = summary;
    if (ext === 'json') {
        content = JSON.stringify({ summary: stripMarkdown(summary) }, null, 2);
    }

    try {
        if (!fs.existsSync(summariesDir)) {
            fs.mkdirSync(summariesDir, { recursive: true });
        }

        if (ext === 'txt') {
            fs.writeFileSync(filePath, stripMarkdown(content), 'utf-8');
        }
        else {
            fs.writeFileSync(filePath, content, 'utf-8');
        }
        console.log(chalk.green(`✅ Summary saved to ${filePath}`));
    } catch (error) {
        console.error(chalk.red(`❌ Failed to save file: ${error.message}`));
    }
}