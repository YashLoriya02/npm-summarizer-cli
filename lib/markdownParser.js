import chalk from 'chalk';

export const applyMarkdownParser = (rawText) => {
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