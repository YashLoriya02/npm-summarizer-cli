# 🚀 Summarizer CLI

#### Instantly summarize code files, functions, or custom prompts using powerful LLMs — right from your terminal. Whether you're reviewing unfamiliar codebases, writing documentation, onboarding new developers, or just need a quick overview of complex logic, Summarizer CLI is your AI-powered assistant. It works with full files or extracts specific functions on demand, and can even handle free-form prompt instructions. With beautifully formatted CLI output and optional export to Markdown, txt, or JSON files, this tool saves hours of reading and guessing. Simple, blazing fast, and developer-friendly — perfect for individuals, teams, and code reviewers alike.

## ✨ Features

* ✅ Summarize any functions, text or full files
* ✅ Extract and summarize specific functions from a file
* ✅ Beautiful CLI output with syntax highlighting
* ✅ Option to export summaries to `.md`, `.txt`, or `.json` in a `./summaries/` folder
* ✅ LLM-powered, fast and accurate summaries

---

## 🚀 Usage

### 🔹 Summarize a Prompt

```bash
summarizer "Summarize what the login function in auth.js does" --apikey your_gemini_key
```

### 🔹 Summarize a Full File

```bash
summarizer -f ./utils/auth.js --apikey your_gemini_key
summarizer --file ./utils/auth.js --apikey your_gemini_key
```

### 🔹 Summarize a Specific Function

```bash
summarizer -f ./src/utils/auth.js -n loginHandler --apikey your_gemini_key
```

### 🔹 Save Output to File

```bash
summarizer -f ./src/utils/utils.js --save --apikey your_gemini_key  # (saves in .md by default)
```

### 🔹 Save in Custom Format

```bash
summarizer -f ./src/utils/auth.js --save --format md --apikey your_gemini_key
summarizer -f ./src/utils.js --save --format txt --apikey your_gemini_key
summarizer "Summarize OTP validation flow" --save --format json --apikey your_gemini_key
```

> 📁 All saved summaries are stored inside the `./summaries/` folder.

---

## 🧾 Options

| Option              | Description                                                    |
| -----------------   | -------------------------------------------------------------- |
| `[prompt]`          | Free-form prompt to generate a summary                         |
| `-f, --file`        | Path to a JavaScript/TypeScript file to summarize              |
| `-n, --function`    | Name of the function to extract and summarize (requires `-f`)  |
| `--save`            | If provided, saves the summary to the `./summaries/` directory |
| `--format <type>`   | Output format: `md`, `txt`, or `json` (used with `--save`)     |
| `--apikey <apikey>` | API key for summary generation using LLM                       |

---

## 🧠 Output Example

```bash
📄 Summary:

📌 Function: sendPasswordResetEmail

• Sends an email with a one-time password (OTP)
• Uses sendEmail() helper
• Logs any errors that occur

📌 Function: getAllConversationSummaries

• Retrieves summaries from database
• Calls AI service if summaries are missing
• Filters visible conversations
• Returns JSON response
```
