#!/usr/bin/env node

import { Command } from 'commander';
import dotenv from 'dotenv';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';
import { summarizePrompt, summarizeFile, summarizeFunction } from '../lib/summarizer.js';
import { extractFunctionFromFile } from '../lib/extractor.js';

marked.setOptions({
    renderer: new TerminalRenderer(),
});

const applyMarkdownParser = (rawText) => {
    return rawText
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*(.*?)\*\*/g, chalk.bold.yellow('$1'))
        .replace(/^\s*\*\*\s*`(.*?)`\s*Function:\*\*/gm, (_, fnName) => {
            return chalk.bold.yellow(`\n📌 Function: ${fnName}\n`);
        })
        // .replace(/^\s*\*+\s?/gm, '• ')
        .replace(/^\s*\*+\s?/gm, '')
        .replace(/\n{2,}/g, '\n');
};


dotenv.config();

const program = new Command();

console.log(gradient.pastel(figlet.textSync('Summarizer CLI 🚀', { horizontalLayout: 'full' })));

program
    .name('summarizer')
    .description('🧠 CLI to summarize code or prompts using LLM.')
    .version('1.2.0');

program
    .argument('[prompt]', 'Prompt text like "Summarize getUser function in file.js"')
    .option('-f, --file <path>', 'Summarize an entire code file')
    .option('-n, --function <functionName>', 'Summarize only a specific function from file (needs --file)')
    .option('--save', 'Save the output to ./summary.<format>')
    .option('--apikey [apikey]', 'Enter the Gemini API key')
    .option('--format <type>', 'Output format: md, txt, or json (used only if --save is passed)')

    .action(async (prompt, options) => {
        const spinner = ora();
        let summary = '';

        try {
            if (!options.apikey) {
                spinner.fail(' Please provide a gemini api key.');
                return
            }
            if (options.function && options.file) {
                spinner.start(`🔍 Extracting function "${options.function}" from ${options.file}...`);
                const fnCode = await extractFunctionFromFile(options.file, options.function);
                spinner.text = 'Summarizing function using LLM...';
                summary = await summarizeFunction(fnCode, options.apikey);
                spinner.succeed('Function summary complete!');
                console.log(chalk.cyanBright('\n📌 Summary:\n') + applyMarkdownParser(summary));

            } else if (options.file) {
                spinner.start(`📄 Reading file: ${options.file}`);
                summary = await summarizeFile(options.file, options.apikey);
                spinner.succeed('File summary complete!');
                console.log(chalk.cyanBright('\n📄 Summary:\n') + applyMarkdownParser(summary));

            } else if (prompt) {
                spinner.start('🧠 Generating prompt-based summary...');
                summary = await summarizePrompt(prompt, options.apikey);
                spinner.succeed('Prompt summary complete!');
                console.log(chalk.cyanBright('\n📌 Summary:\n') + applyMarkdownParser(summary));
            } else {
                spinner.fail('❌ Please provide a prompt or file path.');
            }

            if (options.save) {
                saveSummary(summary, options.format || 'md');
            }
        } catch (err) {
            spinner.fail('🚫 Error occurred');
            console.error(chalk.red('Error:'), err.message);
        }
    });


function saveSummary(summary, format = 'md') {
    const cleanFormat = format.toLowerCase();
    const ext = ['md', 'txt', 'json'].includes(cleanFormat) ? cleanFormat : 'md';
    const summariesDir = path.join(process.cwd(), 'summaries');
    const filePath = path.join(summariesDir, `summary.${ext}`);

    let content = summary;
    if (ext === 'json') {
        content = JSON.stringify({ summary }, null, 2);
    }

    try {
        if (!fs.existsSync(summariesDir)) {
            fs.mkdirSync(summariesDir, { recursive: true });
        }

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(chalk.green(`✅ Summary saved to ${filePath}`));
    } catch (error) {
        console.error(chalk.red(`❌ Failed to save file: ${error.message}`));
    }
}


program.parse();
