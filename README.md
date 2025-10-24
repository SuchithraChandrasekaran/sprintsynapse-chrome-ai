# SprintSynapse
AI-Powered Sprint Intelligence for Agile Teams

## Website
https://suchithrachandrasekaran.github.io/sprintsynapse-chrome-ai

## Overview
SprintSynapse is a Chrome extension that brings AI-powered sprint analysis directly to your Jira workflow. By leveraging Chrome's built-in AI capabilities, it provides instant insights, and generates reports while keeping all your data locally processed for maximum security and privacy.

## Features
- **Smart Sprint Analysis**: Real-time sprint progress analytics and forecasting
- **Automated Reporting**: Generate stakeholder-ready updates instantly
- **Content Optimization**: Improve clarity and professionalism of sprint documentation
- **Privacy-First Design**: All AI processing occurs on-device using Chrome's local models

## Technology Stack
- **Frontend**: JavaScript, HTML5, CSS3
- **AI Engine**: Chrome Built-in AI APIs (Gemini Nano)
- **Integration**: Jira Cloud/Server/Data Center
- **Security**: Local processing - no data leaves your browser

## Directory Structure
```
sprintsynapse-chrome-ai/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── background.js
├── service-worker.js
├ popup.css
└── icons/
    └── icon25.png
    └── icon125.png
```    

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
- Summarizer API: Sprint analysis and reporting

- Prompt API: Blocker risk assessment and contextual analysis

- Writer API: Professional status update generation

## Architecture
Content Scripts: Jira page integration and data extraction

Service Worker: Background operations and API management

Popup Interface: User interaction and results display


## API Integration

#### Chrome Summarizer API

Usage: Sprint analysis and progress summarization

Input: Sprint metrics and completion data

Output: Structured summary with key insights

Fallback: Enhanced template-based analysis

#### Chrome Prompt API
Usage: Contextual blocker analysis and risk assessment

Input: Selected text and issue context

Output: Risk evaluation and recommendations

Configuration: Custom system prompts for Scrum context

#### Chrome Writer API
Usage: Professional status update generation

Input: Sprint progress metrics and team context

Output: Formatted email drafts and reports

Templates: Multiple output formats and styles

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built for the Google Chrome Built-in AI Challenge 2025, demonstrating the power of on-device AI for enterprise productivity.

---
