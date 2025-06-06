import chalk from 'chalk';

export const customHelpText = () => {
    return `
${chalk.bold.cyan('📚 SUMMARIZER CLI - AI-Powered Code Analysis and Summarizer Tool')}

${chalk.yellow('DESCRIPTION:')}
  Instantly summarize code files, functions, or custom prompts using LLM.
  Perfect for code reviews, documentation, and understanding complex codebases.

${chalk.yellow('USAGE:')}
  ${chalk.green('summarizer')} ${chalk.blue('-f <file>')} ${chalk.gray('[options]')}
  ${chalk.green('summarizer')} ${chalk.blue('-f [prompt] <file>')} ${chalk.gray('[options]')}
  ${chalk.green('summarizer')} ${chalk.blue('-f <file> -n [prompt] <function>')} ${chalk.gray('[options]')}

${chalk.yellow('ARGUMENTS:')}
  ${chalk.blue('[prompt]')}              Free-form text prompt for AI analysis
                            ${chalk.dim('Example: "Explain authorizeUser function in middleware.js"')}

${chalk.yellow('OPTIONS:')}
  ${chalk.blue('-f, --file <path>')}        Analyze an entire code file
                            ${chalk.dim('Supports JS, TS, Python, Java, Dart, C/C++, etc.')}
  
  ${chalk.blue('-n, --function <name>')}    Extract and analyze specific function from file (passed as -f file.js)
                            ${chalk.dim('Requires --file option')}
  
  ${chalk.blue('--save')}                   Save output to ./summaries/ directory
                            ${chalk.dim('Auto-creates directory if not exists')}
  
  ${chalk.blue('--format <type>')}          Output format when saving
                            ${chalk.dim('Options: md (default), txt, json')}
  
  ${chalk.blue('--apikey <key>')}           Gemini API key for AI analysis
                            ${chalk.dim('Required for all operations')}
  
  ${chalk.blue('-h, --help')}               Show this help message

${chalk.yellow('EXAMPLES:')}

  ${chalk.dim('1. Analyze entire file:')}
  ${chalk.green('summarizer')} ${chalk.blue('-f ./src/utils.js')} ${chalk.gray('--apikey YOUR_KEY')}

  ${chalk.dim('2. Analyze specific function:')}
  ${chalk.green('summarizer')} ${chalk.blue('-f ./utils/helpers.js -n validateEmail')} ${chalk.gray('--apikey YOUR_KEY')}

  ${chalk.dim('3. Save analysis as markdown:')}
  ${chalk.green('summarizer')} ${chalk.blue('-f ./components/Login.tsx --save --format md')} ${chalk.gray('--apikey YOUR_KEY')}

  ${chalk.dim('4. Custom prompt analysis:')}
  ${chalk.green('summarizer')} ${chalk.blue('"Explain JWT authentication flow"')} ${chalk.gray('--apikey YOUR_KEY')}

  ${chalk.dim('5. Analyze and export as JSON:')}
  ${chalk.green('summarizer')} ${chalk.blue('-f ./api/routes.js --save --format json')} ${chalk.gray('--apikey YOUR_KEY')}

${chalk.yellow('OUTPUT FORMATS:')}
  ${chalk.blue('md')}   Markdown format with headers and proper formatting
  ${chalk.blue('txt')}  Plain text format for simple reading
  ${chalk.blue('json')} Structured JSON for programmatic use

${chalk.yellow('SUPPORTED LANGUAGES:')}
  JavaScript, TypeScript, Python, Dart, Java, C/C++, C#, PHP, Ruby, Go, Rust, Kotlin, Swift

${chalk.yellow('API KEY SETUP:')}
  1. Get your free API key from: ${chalk.underline('https://ai.google.dev/')}
  2. Use it with: ${chalk.blue('--apikey YOUR_GEMINI_API_KEY')}

${chalk.yellow('NOTES:')}
  • All summaries are saved in ${chalk.blue('./summaries/')} directory
  • Function extraction works with multiple programming languages
  • Output includes syntax highlighting and structured formatting
  • API key is required for all AI-powered operations
  • For more precise understanding, save the file in MD format and use any online MD-Parser tool

${chalk.yellow('TROUBLESHOOTING:')}
  • ${chalk.red('API Key Error:')} Ensure your Gemini API key is valid and has quota
  • ${chalk.red('File Not Found:')} Check file path and permissions
  • ${chalk.red('Function Not Found:')} Verify function name spelling and case sensitivity

${chalk.dim('For more information, visit:')} ${chalk.underline('https://github.com/YashLoriya02/summarizer-cli')}
${chalk.dim('Feel free to contact me at:')} ${chalk.underline('yashloriya0206@gmail.com')}
`;
};