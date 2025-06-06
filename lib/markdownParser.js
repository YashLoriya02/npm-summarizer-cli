import chalk from 'chalk';

export const applyMarkdownParser = (rawText) => {
    if (!rawText || typeof rawText !== 'string') {
        return '';
    }

    let formattedText = rawText;

    // Headers
    formattedText = formattedText
        .replace(/^### (.*$)/gm, chalk.bold.blue('\n🔧 $1\n'))
        .replace(/^## (.*$)/gm, chalk.bold.cyan('\n📋 $1\n'))
        .replace(/^# (.*$)/gm, chalk.bold.magenta('\n🎯 $1\n'));

    // Code blocks
    formattedText = formattedText.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang ? chalk.dim(`[${lang}]`) : '';
        const styledCode = chalk.gray(code.trim());
        return `\n${language}\n${styledCode}\n`;
    });

    // Inline code
    formattedText = formattedText.replace(/`([^`\n]+)`/g, chalk.black(' $1 '));

    // Bold text
    formattedText = formattedText
        .replace(/\*\*(.*?)\*\*/g, chalk.bold.yellow('$1'))
        .replace(/__(.*?)__/g, chalk.bold.yellow('$1'));

    // Italic text
    formattedText = formattedText
        .replace(/(?<!\*)\*([^\*\n]+)\*(?!\*)/g, chalk.italic('$1'))
        .replace(/(?<!_)_([^_\n]+)_(?!_)/g, chalk.italic('$1'));

    // Bullet points and lists
    formattedText = formattedText
        .replace(/^\s*[\*\-\+]\s+(.+)$/gm, chalk.green('  • ') + '$1')
        .replace(/^\s*\d+\.\s+(.+)$/gm, (match, content, offset, string) => {
            const lineStart = string.lastIndexOf('\n', offset) + 1;
            const currentLine = string.substring(lineStart, offset);
            const indentLevel = currentLine.match(/^\s*/)[0].length;
            const number = match.match(/^\s*(\d+)\./)[1];
            return ' '.repeat(indentLevel) + chalk.blue(`${number}.`) + ` ${content}`;
        });

    // Function annotations
    formattedText = formattedText.replace(/^\s*\*\*\s*`(.*?)`\s*Function:\*\*/gm, (_, fnName) => {
        return chalk.bold.yellow(`\n📌 Function: ${fnName}\n`);
    });

    // Links
    formattedText = formattedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
        chalk.blue.underline('$1') + chalk.dim(' ($2)'));

    // Strikethrough text
    formattedText = formattedText.replace(/~~(.*?)~~/g, chalk.strikethrough('$1'));

    // Blockquotes
    formattedText = formattedText.replace(/^\s*>\s*(.+)$/gm,
        chalk.gray('│ ') + chalk.italic.gray('$1'));

    // Horizontal rules
    formattedText = formattedText.replace(/^[\s]*[\*\-_]{3,}[\s]*$/gm,
        chalk.gray('─'.repeat(50)));

    // Spacing around sections
    formattedText = formattedText
        .replace(/(\n📋|\n🔧|\n💡|\n🎯|\n📥|\n📤|\n⚙️|\n🔍|\n⚠️)/g, '\n$1');

    // Clean up
    formattedText = formattedText
        .replace(/\n{3,}/g, '\n\n')
        .replace(/^\s+$/gm, '')
        .trim();

    return formattedText;
};

// Fallback (Better for MD view not for terminal)
export const applyAdvancedMarkdownParser = (rawText, options = {}) => {
    const {
        useEmojis = true,
        colorScheme = 'default',
        maxWidth = 80,
        preserveCodeFormatting = true
    } = options;

    if (!rawText || typeof rawText !== 'string') {
        return '';
    }

    let formattedText = rawText;

    const schemes = {
        default: {
            h1: chalk.bold.magenta,
            h2: chalk.bold.cyan,
            h3: chalk.bold.blue,
            code: chalk.bgGray.black,
            bold: chalk.bold.yellow,
            italic: chalk.italic,
            link: chalk.blue.underline,
            bullet: chalk.green
        },
        minimal: {
            h1: chalk.bold,
            h2: chalk.bold,
            h3: chalk.bold,
            code: chalk.inverse,
            bold: chalk.bold,
            italic: chalk.italic,
            link: chalk.underline,
            bullet: chalk.white
        },
        vibrant: {
            h1: chalk.bold.red,
            h2: chalk.bold.yellow,
            h3: chalk.bold.green,
            code: chalk.bgBlue.white,
            bold: chalk.bold.magenta,
            italic: chalk.italic.cyan,
            link: chalk.blue.underline,
            bullet: chalk.red
        }
    };

    const colors = schemes[colorScheme] || schemes.default;

    formattedText = formattedText
        .replace(/^### (.*$)/gm, useEmojis ? colors.h3('\n🔧 $1\n') : colors.h3('\n$1\n'))
        .replace(/^## (.*$)/gm, useEmojis ? colors.h2('\n📋 $1\n') : colors.h2('\n$1\n'))
        .replace(/^# (.*$)/gm, useEmojis ? colors.h1('\n🎯 $1\n') : colors.h1('\n$1\n'))

        .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            if (!preserveCodeFormatting) return colors.code(code.trim());
            const language = lang ? chalk.dim(`[${lang}]`) : '';
            return `\n${language}\n${colors.code(' ' + code.trim() + ' ')}\n`;
        })

        .replace(/`([^`\n]+)`/g, colors.code(' $1 '))

        .replace(/\*\*(.*?)\*\*/g, colors.bold('$1'))
        .replace(/(?<!\*)\*([^\*\n]+)\*(?!\*)/g, colors.italic('$1'))

        .replace(/^\s*[\*\-\+]\s+(.+)$/gm, colors.bullet('  • ') + '$1')

        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, colors.link('$1') + chalk.dim(' ($2)'))

        .replace(/\n{3,}/g, '\n\n')
        .trim();

    if (maxWidth && maxWidth > 0) {
        formattedText = wrapText(formattedText, maxWidth);
    }

    return formattedText;
};

// Helper fn in applyAdvancedMarkdownParser
const wrapText = (text, maxWidth) => {
    return text.split('\n').map(line => {
        if (line.length <= maxWidth) return line;

        if (/^[\s]*[📋🔧💡🎯📥📤⚙️🔍⚠️•\-\*\d+\.]/.test(line)) {
            return line;
        }

        const words = line.split(' ');
        const wrappedLines = [];
        let currentLine = '';

        for (const word of words) {
            if ((currentLine + word).length <= maxWidth) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                if (currentLine) wrappedLines.push(currentLine);
                currentLine = word;
            }
        }

        if (currentLine) wrappedLines.push(currentLine);
        return wrappedLines.join('\n');
    }).join('\n');
}

// Function for cleaning text in .txt saving
export const stripMarkdown = (text) => {
    return text
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^#+\s*/gm, '')
        .replace(/^\s*[\*\-\+]\s*/gm, '')
        .replace(/^\s*\d+\.\s*/gm, '')
        .replace(/^\s*>\s*/gm, '')
        .replace(/\n{2,}/g, '\n')
        .trim();
};