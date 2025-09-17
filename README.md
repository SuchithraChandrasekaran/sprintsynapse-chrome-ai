# SprintSynapse
AI-Powered Sprint Intelligence for Agile Teams

## Overview
SprintSynapse is a Chrome extension that brings AI-powered sprint analysis directly to your Jira workflow. By leveraging Chrome's built-in AI capabilities, it provides instant insights, identifies blockers, and generates reports while keeping all your data locally processed for maximum security and privacy.

## Features
- **Smart Sprint Analysis**: Real-time sprint progress analytics and forecasting
- **Blocker Detection**: Early identification of potential impediments
- **Automated Reporting**: Generate stakeholder-ready updates instantly
- **Multi-language Support**: Translate content directly within Jira
- **Content Optimization**: Improve clarity and professionalism of sprint documentation
- **Privacy-First Design**: All AI processing occurs on-device using Chrome's local models

## Technology Stack
- **Frontend**: JavaScript, HTML5, CSS3
- **AI Engine**: Chrome Built-in AI APIs (Gemini Nano)
- **Integration**: Jira Cloud/Server/Data Center
- **Security**: Local processing - no data leaves your browser

## Installation

### Prerequisites
- Google Chrome (version 121+)
- Access to Jira instance
- Chrome AI APIs enabled

### Enable Chrome AI Flags
chrome://flags/#optimization-guide-on-device-model
chrome://flags/#prompt-api-for-gemini-nano
chrome://flags/#summarization-api-for-gemini-nano


### Load Extension
1. Clone repository: `git clone https://github.com/suchithrachandrasekaran/sprintsynapse-chrome-ai.git`
2. Open `chrome://extensions/`
3. Enable Developer mode
4. Click "Load unpacked" and select project directory

## Usage

1. Navigate to any Jira sprint page or backlog
2. Right-click on content or use extension popup
3. Select desired AI function (Summarize, Analyze, Translate)
4. Receive instant insights directly in your browser
5. Copy or export results as needed

## Supported APIs

- Prompt API for custom analysis
- Summarizer API for sprint reports
- Writer API for status updates
- Translator API for multilingual support
- Rewriter API for content optimization
- Proofreader API for documentation quality

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built for the Google Chrome Built-in AI Challenge 2025, demonstrating the power of on-device AI for enterprise productivity.

---
