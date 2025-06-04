# 🚀 Summarizer CLI

#### Instantly summarize code files, functions, or custom prompts using powerful LLMs — right from your terminal. Whether you're reviewing unfamiliar codebases, writing documentation, onboarding new developers, or just need a quick overview of complex logic, Summarizer CLI is your AI-powered assistant. It works with full JavaScript/TypeScript files or extracts specific functions on demand, and can even handle free-form prompt instructions. With beautifully formatted CLI output and optional export to Markdown, text, or JSON files, this tool saves hours of reading and guessing. Simple, blazing fast, and developer-friendly — perfect for individuals, teams, and code reviewers alike.
---

## ✨ Features

* ✅ Summarize full files
* ✅ Extract and summarize specific functions from a file
* ✅ Beautiful CLI output with syntax highlighting and emojis
* ✅ Optional export to `.md`, `.txt`, or `.json` in a `./summaries/` folder
* ✅ LLM-powered, fast and accurate summaries

---

## 🚀 Usage

### 🔹 Summarize a Prompt

```bash
summarizer "Summarize what the login function in auth.js does"
```

### 🔹 Summarize a Full File

```bash
summarizer -f ./utils/auth.js
summarizer --file ./utils/auth.js
```

### 🔹 Summarize a Specific Function

```bash
summarizer -f ./src/utils/auth.js -n loginHandler
```

### 🔹 Save Output to File

```bash
summarizer -f ./src/utils/auth.js --save  # (saves in .md by default)
```

### 🔹 Save in Custom Format

```bash
summarizer -f ./src/utils/auth.js --save --format md
summarizer -f ./src/utils/auth.js --save --format txt
summarizer "Summarize OTP validation flow" --save --format json
```

> 📁 All saved summaries are stored inside the `./summaries/` folder.

---

## 🧾 Options

| Option            | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| `[prompt]`        | Free-form prompt to generate a summary                         |
| `-f, --file`      | Path to a JavaScript/TypeScript file to summarize              |
| `-n, --function`  | Name of the function to extract and summarize (requires `-f`)  |
| `--save`          | If provided, saves the summary to the `./summaries/` directory |
| `--format <type>` | Output format: `md`, `txt`, or `json` (used with `--save`)     |

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
