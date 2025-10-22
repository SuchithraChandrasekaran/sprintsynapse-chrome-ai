// SprintSynapse - with Chrome Built-in AI
console.log("SprintSynapse AI - Enhanced Edition with Chrome Built-in AI Support");

class SprintSynapse {
    constructor() {
        this.aiCapabilities = {
            summarizer: false,
            writer: false,
            prompt: false,
        };
        this.isProcessing = false; 
        this.initialize();
    }

    async initialize() {
        console.log("SprintSynapse initialized");
        
        // Check AI capabilities
        await this.checkAICapabilities();
        
        document.addEventListener('mouseup', () => {
            window.sprintSynapseSelectedText = window.getSelection().toString().trim();
        });
    }

    // CHECK AI CAPABILITIES - Chrome Built-in AI
    async checkAICapabilities() {
        try {
            // Check for self.ai (newer) or window.ai (compatibility)
            const aiAPI = self.ai || window.ai;
            
            if (!aiAPI) {
                console.log("Chrome Built-in AI not available");
                console.log("Make sure you're using Chrome Canary 128+ with flags enabled:");
                console.log("chrome://flags/#optimization-guide-on-device-model");
                console.log("chrome://flags/#prompt-api-for-gemini-nano");
                return;
            }

            // Check Summarizer API
            if (aiAPI.summarizer && typeof aiAPI.summarizer.capabilities === 'function') {
                try {
                    const canSummarize = await aiAPI.summarizer.capabilities();
                    this.aiCapabilities.summarizer = canSummarize.available === 'readily' || canSummarize.available === 'after-download';
                    console.log("Summarizer API available:", this.aiCapabilities.summarizer, canSummarize);
                } catch (e) {
                    console.log("Summarizer API check failed:", e);
                    this.aiCapabilities.summarizer = false;
                }
            } else {
                console.log("Summarizer API not found");
                this.aiCapabilities.summarizer = false;
            }

            // Check Writer API
            if (aiAPI.writer && typeof aiAPI.writer.capabilities === 'function') {
                try {
                    const canWrite = await aiAPI.writer.capabilities();
                    this.aiCapabilities.writer = canWrite.available === 'readily' || canWrite.available === 'after-download';
                    console.log("Writer API available:", this.aiCapabilities.writer, canWrite);
                } catch (e) {
                    console.log("Writer API check failed:", e);
                    this.aiCapabilities.writer = false;
                }
            } else {
                console.log("Writer API not found");
                this.aiCapabilities.writer = false;
            }

            // Check Prompt API (languageModel)
            if (aiAPI.languageModel && typeof aiAPI.languageModel.capabilities === 'function') {
                try {
                    const canPrompt = await aiAPI.languageModel.capabilities();
                    this.aiCapabilities.prompt = canPrompt.available === 'readily' || canPrompt.available === 'after-download';
                    console.log("Prompt API available:", this.aiCapabilities.prompt, canPrompt);
                } catch (e) {
                    console.log("Prompt API check failed:", e);
                    this.aiCapabilities.prompt = false;
                }
            } else {
                console.log("Prompt API (languageModel) not found");
                this.aiCapabilities.prompt = false;
            }

            console.log("Final AI Capabilities:", this.aiCapabilities);
            
        } catch (error) {
            console.error("Error checking AI capabilities:", error);
            this.aiCapabilities = {
                summarizer: false,
                writer: false,
                prompt: false
            };
        }
    }

    // CHECK IF ON JIRA PAGE
    isJiraPage() {
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;
        const url = window.location.href;
        
        // EXCLUDE marketing/documentation pages
        const excludedPaths = [
            '/software/jira',
            '/software/jira/',
            '/trial/jira/',
            '/pricing/',
            '/blog/',
            '/community/',
            '/documentation/',
            '/help/',
            '/support/'
        ];
        
        const excludedDomains = [
            'www.atlassian.com',
            'confluence.atlassian.com',
            'community.atlassian.com',
            'support.atlassian.com',
            'developer.atlassian.com'
        ];
        
        // Check if current URL matches any excluded patterns
        const isExcludedDomain = excludedDomains.some(domain => hostname === domain);
        const isExcludedPath = excludedPaths.some(path => pathname.includes(path));
        const isMarketingPage = url.includes('/trial/') || 
                            url.includes('/pricing/');
        
        if (isExcludedDomain || isExcludedPath || isMarketingPage) {
            return false;
        }
        
        // POSITIVE JIRA INDICATORS
        const isJiraDomain = hostname.includes('jira') || 
                            hostname.includes('atlassian.net') ||
                            hostname.includes('atlassian.io');
        
        const isJiraPath = pathname.includes('/jira/') || 
                        pathname.includes('/browse/') || 
                        pathname.includes('/secure/') ||
                        pathname.includes('/projects/') ||
                        pathname.includes('/issues/');
        
        const hasJiraElements = document.querySelector('[data-test-id*="jira"]') !== null ||
                            document.querySelector('[class*="jira"]') !== null ||
                            document.querySelector('#jira') !== null ||
                            document.querySelector('[data-testid*="issue"]') !== null ||
                            document.querySelector('[data-test-id*="issue"]') !== null ||
                            document.querySelector('.jira-page') !== null;
        
        // Must have at least one strong positive indicator
        return (isJiraDomain && !isMarketingPage) || 
            isJiraPath || 
            hasJiraElements;
    }

    // SPRINT SUMMARY with Chrome Built-in AI
    async generateSummary() {
        if (!this.isJiraPage()) {
            this.showNotification('⚠️ This feature only works on Jira pages', 'warning');
            return { success: false, error: "Not on Jira page" };
        }
        
        try {
            console.log("Starting sprint summary generation...");
            const userInput = await this.showInputForm('Sprint Analysis');
            console.log("User input received:", userInput);
            
            let analysis;
            let source = 'enhanced-analytics';
            
            // Try Chrome Built-in AI APIs in order of preference
            try {
                // First try: Prompt API (most flexible)
                if (this.aiCapabilities.prompt) {
                    analysis = await this.tryPromptAPI(userInput, 'summary');
                    source = 'chrome-prompt-api';
                }
                // Second try: Summarizer API
                else if (this.aiCapabilities.summarizer) {
                    analysis = await this.trySummarizerAPI(userInput);
                    source = 'chrome-summarizer-api';
                }
                // Fallback: Enhanced template
                else {
                    throw new Error('No AI APIs available');
                }
            } catch (aiError) {
                console.log("AI APIs failed, using enhanced analysis:", aiError);
                analysis = this.generateEnhancedAnalysis(userInput);
                source = 'enhanced-analytics';
            }
            
            this.showResults(analysis, 'Sprint Analysis', source, userInput);
            
            return { success: true, data: analysis, source: source };
        } catch (error) {
            if (error.message === 'User cancelled') {
                console.log("Summary generation cancelled by user");
                return { success: true, cancelled: true };
            }
            
            if (error.message === 'Form already open') {
                return { success: false, error: error.message };
            }

            // Only log actual errors
            console.error("Summary generation error:", error);
            return { success: false, error: error.message };
        }
    }

    // STATUS UPDATE with Chrome Built-in AI
    async generateStatusUpdate() {
         // PREVENT MULTIPLE SUBMISSIONS
        if (this.isProcessing) {
            return { success: false, error: "Already processing" };
        }
        if (!this.isJiraPage()) {
            this.showNotification('⚠️ This feature only works on Jira pages', 'warning');
            return { success: false, error: "Not on Jira page" };
        }
        
        try {
            this.isProcessing = true;// LOCK
            console.log("Starting status update generation...");
            const userInput = await this.showInputForm('Status Update');
            console.log("User input received:", userInput);
            
            let update;
            let source = 'professional-template';
            
            // Try Chrome Built-in AI APIs
            try {
                // First try: Writer API
                if (this.aiCapabilities.writer) {
                    update = await this.tryWriterAPI(userInput);
                    source = 'chrome-writer-api';
                }
                // Second try: Prompt API
                else if (this.aiCapabilities.prompt) {
                    update = await this.tryPromptAPI(userInput, 'status');
                    source = 'chrome-prompt-api';
                }
                // Fallback: Professional template
                else {
                    throw new Error('No AI APIs available');
                }
            } catch (aiError) {
                console.log("AI APIs failed, using template:", aiError);
                const result = this.generateProfessionalUpdate(userInput);
                update = result.content;
                source = 'professional-template';
            }
            
            const action = await this.showSharingOptions();
            
            // Handle cancellation gracefully
            if (action === 'cancelled') {
                this.showNotification('Export cancelled', 'info');
                return { success: true, data: update, source: source, cancelled: true };
            }
            
            if (action === 'copy') {
                await this.copyToClipboard(update);
                this.showNotification('Status update copied!', 'success');
            } else if (action === 'gmail' || action === 'outlook') {
                this.openInApp(update, action);
            } else if (action === 'pdf') {
                this.exportToPDF(update, userInput);
            } else if (action === 'csv') {
                this.exportToCSV(userInput);
            }
            
            return { success: true, data: update, source: source };
        } catch (error) {
            if (error.message === 'User cancelled') {
                console.log("Status update cancelled by user");
                return { success: true, cancelled: true };
            }
            
            // Form already open is a handled state
            if (error.message === 'Form already open') {
                return { success: false, error: error.message };
            }
            
            // Only log actual errors
            console.error("Status Update error:", error);
            this.showNotification('Please enter valid sprint details', 'error');
            return { success: false, error: error.message };
        }
        finally {
            this.isProcessing = false; // UNLOCK 
        }
    }

    // CHROME BUILT-IN AI: PROMPT API
    async tryPromptAPI(sprintData, type = 'summary') {
        try {
            const aiAPI = self.ai || window.ai;
            if (!aiAPI || !aiAPI.languageModel) {
                throw new Error('Prompt API not available');
            }

            const session = await aiAPI.languageModel.create({
                systemPrompt: "You are a professional sprint analyst. Create clear, concise, and actionable sprint reports."
            });

            let prompt;
            if (type === 'summary') {
                prompt = `Create a comprehensive sprint analysis summary with metrics and insights.

Sprint Details:
- Sprint Name: ${sprintData.sprintName}
- To Do: ${sprintData.todo} issues
- In Progress: ${sprintData.inProgress} issues
- Done: ${sprintData.done} issues
- Total: ${sprintData.todo + sprintData.inProgress + sprintData.done} issues

Include: completion rate, progress metrics, sprint health assessment, and actionable recommendations.`;
            } else {
                prompt = `Create a professional sprint status update email.

Sprint Details:
- Sprint Name: ${sprintData.sprintName}
- Completed: ${sprintData.done} issues
- In Progress: ${sprintData.inProgress} issues
- To Do: ${sprintData.todo} issues

Format as a professional email with progress summary, current status, and next steps.`;
            }

            const result = await session.prompt(prompt);
            await session.destroy();

            return result;
        } catch (error) {
            console.error("Prompt API error:", error);
            throw error;
        }
    }

    // CHROME BUILT-IN AI: SUMMARIZER API
    async trySummarizerAPI(sprintData) {
        try {
            const aiAPI = self.ai || window.ai;
            if (!aiAPI || !aiAPI.summarizer) {
                throw new Error('Summarizer API not available');
            }

            const summarizer = await aiAPI.summarizer.create({
                type: 'key-points',
                format: 'markdown',
                length: 'long'
            });

            const inputText = `Sprint Analysis Report for ${sprintData.sprintName}

Current Sprint Status:
- Total Issues: ${sprintData.todo + sprintData.inProgress + sprintData.done}
- Completed Tasks: ${sprintData.done} issues (${Math.round((sprintData.done / (sprintData.todo + sprintData.inProgress + sprintData.done)) * 100)}% completion rate)
- Work in Progress: ${sprintData.inProgress} issues actively being worked on
- Remaining Backlog: ${sprintData.todo} issues pending start

Progress Metrics:
- Overall sprint progress shows ${sprintData.done > sprintData.todo + sprintData.inProgress ? 'excellent' : sprintData.done > sprintData.todo ? 'good' : 'moderate'} momentum
- Team velocity indicates ${Math.round(sprintData.done / 2)} story points per week
- Current burn rate suggests ${sprintData.done > (sprintData.todo + sprintData.inProgress + sprintData.done) * 0.6 ? 'on track' : 'needs attention'} for sprint goals

Key Observations:
- Sprint health status is ${sprintData.done > (sprintData.todo + sprintData.inProgress + sprintData.done) * 0.7 ? 'excellent with strong completion rates' : 'requiring focused effort on remaining items'}
- Workload distribution shows ${sprintData.inProgress} items actively in development
- Risk assessment indicates ${(sprintData.todo + sprintData.inProgress) / (sprintData.todo + sprintData.inProgress + sprintData.done) > 0.6 ? 'elevated risk requiring attention' : 'manageable risk levels'}

Recommendations for Sprint Success:
- ${sprintData.done > (sprintData.todo + sprintData.inProgress + sprintData.done) * 0.7 ? 'Continue current pace and prepare for sprint review' : 'Increase focus on high-priority items and address blockers'}
- Monitor daily progress and adjust team capacity as needed
- Maintain clear communication channels for dependency management`;

            const summary = await summarizer.summarize(inputText);
            await summarizer.destroy();

            return `SPRINT ANALYSIS: ${sprintData.sprintName}
Generated: ${new Date().toLocaleDateString()}
Source: Chrome Built-in AI (Summarizer API)

${summary}

METRICS OVERVIEW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Completed:    ${sprintData.done} issues
In Progress:  ${sprintData.inProgress} issues
To Do:        ${sprintData.todo} issues
Total Issues: ${sprintData.todo + sprintData.inProgress + sprintData.done}

${this.generateProgressBar(Math.round((sprintData.done / (sprintData.todo + sprintData.inProgress + sprintData.done)) * 100))}`;

        } catch (error) {
            console.error("Summarizer API error:", error);
            throw error;
        }
    }

    // CHROME BUILT-IN AI: WRITER API
    async tryWriterAPI(sprintData) {
        try {
            const aiAPI = self.ai || window.ai;
            if (!aiAPI || !aiAPI.writer) {
                throw new Error('Writer API not available');
            }

            const writer = await aiAPI.writer.create({
                tone: 'formal',
                format: 'plain-text',
                length: 'medium'
            });

            const context = `Write a professional sprint status update email for ${sprintData.sprintName}. 

Include these metrics:
- Completed: ${sprintData.done} issues
- In Progress: ${sprintData.inProgress} issues
- To Do: ${sprintData.todo} issues
- Total: ${sprintData.todo + sprintData.inProgress + sprintData.done} issues
- Completion Rate: ${Math.round((sprintData.done / (sprintData.todo + sprintData.inProgress + sprintData.done)) * 100)}%

The email should include: progress summary, current status assessment, and next steps.`;

            const result = await writer.write(context);
            await writer.destroy();

            return result;
        } catch (error) {
            console.error("Writer API error:", error);
            throw error;
        }
    }

    // GENERATE BURN-DOWN CHART
    generateBurnDownChart(sprintData) {
        const total = sprintData.todo + sprintData.inProgress + sprintData.done;
        const sprintLength = 10;
        
        let chart = '\nBURN-DOWN CHART:\n';
        chart += '━'.repeat(50) + '\n';
        chart += 'Issues\n';
        chart += 'Remaining\n';
        
        const maxHeight = 10;
        const scale = total / maxHeight;
        
        const idealBurnRate = total / sprintLength;
        const remaining = sprintData.todo + sprintData.inProgress;
        const actualBurnRate = (total - remaining) / 5;
        
        for (let row = maxHeight; row >= 0; row--) {
            const value = Math.round(row * scale);
            chart += `${value.toString().padStart(3)} │`;
            
            for (let day = 0; day <= sprintLength; day++) {
                const idealRemaining = total - (idealBurnRate * day);
                const actualRemaining = day <= 5 ? (total - actualBurnRate * day) : null;
                
                const idealHeight = Math.round(idealRemaining / scale);
                const actualHeight = actualRemaining ? Math.round(actualRemaining / scale) : null;
                
                if (idealHeight === row && actualHeight === row) {
                    chart += '◆';
                } else if (idealHeight === row) {
                    chart += '•';
                } else if (actualHeight === row) {
                    chart += '■';
                } else if (row === 0) {
                    chart += '─';
                } else {
                    chart += ' ';
                }
            }
            chart += '\n';
        }
        
        chart += '    └';
        for (let i = 0; i <= sprintLength; i++) chart += '─';
        chart += '> Days\n';
        chart += '     0  1  2  3  4  5  6  7  8  9  10\n\n';
        chart += 'Legend: • Ideal  ■ Actual\n';
        chart += `Current Status: ${remaining} issues remaining (Day 5)\n`;
        
        return chart;
    }

    // GENERATE VELOCITY CHART
    generateVelocityChart(sprintData) {
        const completedPoints = sprintData.done;
        const avgVelocity = Math.round(completedPoints / 2);
        
        const sprints = [
            { name: 'Sprint 1', points: avgVelocity - 5 },
            { name: 'Sprint 2', points: avgVelocity - 2 },
            { name: 'Sprint 3', points: avgVelocity + 3 },
            { name: 'Sprint 4', points: avgVelocity },
            { name: 'Current', points: completedPoints }
        ];
        
        let chart = '\nVELOCITY CHART (Story Points per Sprint):\n';
        chart += '━'.repeat(50) + '\n';
        
        const maxPoints = Math.max(...sprints.map(s => s.points));
        const maxHeight = 10;
        const scale = maxPoints / maxHeight;
        
        for (let row = maxHeight; row >= 0; row--) {
            const value = Math.round(row * scale);
            chart += `${value.toString().padStart(3)} │`;
            
            sprints.forEach(sprint => {
                const barHeight = Math.round(sprint.points / scale);
                if (barHeight >= row) {
                    chart += sprint.name === 'Current' ? '███ ' : '▓▓▓ ';
                } else {
                    chart += '    ';
                }
            });
            chart += '\n';
        }
        
        chart += '    └' + '─'.repeat(21) + '\n';
        chart += '     S1  S2  S3  S4  Now\n\n';
        chart += `Average Velocity: ${avgVelocity} points/sprint\n`;
        chart += `Current Sprint: ${completedPoints} points completed\n`;
        chart += `Trend: ${completedPoints > avgVelocity ? '↗ Increasing' : completedPoints < avgVelocity ? '↘ Decreasing' : '→ Stable'}\n`;
        
        return chart;
    }

    // ENHANCED ANALYSIS (Fallback)
    generateEnhancedAnalysis(sprintData) {
        const total = sprintData.todo + sprintData.inProgress + sprintData.done;
        const completionRate = total > 0 ? Math.round((sprintData.done / total) * 100) : 0;
        const progressRate = total > 0 ? Math.round(((sprintData.done + sprintData.inProgress) / total) * 100) : 0;
        const velocity = Math.round(sprintData.done / 2);

        const summary = `SPRINT ANALYSIS: ${sprintData.sprintName}
Generated: ${new Date().toLocaleDateString()}

PROGRESS OVERVIEW:
${'━'.repeat(40)}
Completed:    ${sprintData.done} issues
In Progress:  ${sprintData.inProgress} issues
To Do:        ${sprintData.todo} issues
Total Issues: ${total}

VISUAL PROGRESS METRICS:
${'━'.repeat(40)}

Completion Rate: ${completionRate}%
${this.generateProgressBar(completionRate)}

Overall Progress: ${progressRate}%
${this.generateProgressBar(progressRate)}

${this.generateBurnDownChart(sprintData)}

${this.generateVelocityChart(sprintData)}

VELOCITY TRACKING:
${'━'.repeat(40)}
Current Velocity: ${velocity} points/week
Estimated Capacity: ${Math.round(total * 0.7)} points
Burn Rate: ${Math.round((sprintData.done / total) * 100)}% completed

ISSUE DISTRIBUTION:
${'━'.repeat(40)}
${this.generateDistributionChart(sprintData)}

KEY METRICS:
${'━'.repeat(40)}
• Sprint Health: ${this.getSprintHealth(completionRate)}
• Team Efficiency: ${this.getEfficiency(progressRate)}
• Risk Level: ${this.getRiskLevel(sprintData)}

RECOMMENDATIONS:
${'━'.repeat(40)}
${this.getRecommendations(completionRate, sprintData)}

[Sprint Analysis]`;

        return summary;
    }

    generateProfessionalUpdate(sprintData) {
        const total = sprintData.todo + sprintData.inProgress + sprintData.done;
        const completionRate = total > 0 ? Math.round((sprintData.done / total) * 100) : 0;
        
        const content = `Sprint Status Update - ${sprintData.sprintName}
Date: ${new Date().toLocaleDateString()}

PROGRESS SUMMARY:
${'━'.repeat(40)}
Completed: ${sprintData.done} issues (${completionRate}%)
In Progress: ${sprintData.inProgress} issues
Remaining: ${sprintData.todo} issues
Total Issues: ${total}

VISUAL PROGRESS:
${this.generateProgressBar(completionRate)}

CURRENT STATUS:
${'━'.repeat(40)}
${completionRate >= 70 ? '🟢 The sprint is progressing well with strong momentum.' :
completionRate >= 40 ? '🟡 Steady progress is being made with consistent output.' :
'🔴 Active work is underway on current priorities.'}

NEXT STEPS:
${'━'.repeat(40)}
${completionRate >= 70 ? '• Finalize remaining items\n• Prepare for demo and retrospective' :
completionRate >= 40 ? '• Continue current pace\n• Address any emerging blockers' :
'• Focus on high-priority items\n• Coordinate on dependencies'}

Best regards,
The Sprint Team `;

        return { success: true, content: content, source: 'professional-template' };
    }

    // VISUAL PROGRESS BAR
    generateProgressBar(percentage) {
        const filled = Math.round(percentage / 5);
        const empty = 20 - filled;
        const bar = '■'.repeat(filled) + '□'.repeat(empty);
        return `[${bar}] ${percentage}%`;
    }

    // DISTRIBUTION CHART
    generateDistributionChart(sprintData) {
        const total = sprintData.todo + sprintData.inProgress + sprintData.done;
        const todoBar = '■'.repeat(Math.round((sprintData.todo / total) * 30));
        const progressBar = '■'.repeat(Math.round((sprintData.inProgress / total) * 30));
        const doneBar = '■'.repeat(Math.round((sprintData.done / total) * 30));
        
        return `To Do:       ${todoBar} ${sprintData.todo}
In Progress: ${progressBar} ${sprintData.inProgress}
Done:        ${doneBar} ${sprintData.done}`;
    }

    getSprintHealth(rate) {
        if (rate >= 70) return '🟢 Excellent';
        if (rate >= 50) return '🟡 Good';
        if (rate >= 30) return '🟠 Fair';
        return '🔴 Needs Attention';
    }

    getEfficiency(rate) {
        if (rate >= 80) return '⚡ High';
        if (rate >= 60) return '✓ Moderate';
        return '↓ Low';
    }

    getRiskLevel(data) {
        const total = data.todo + data.inProgress + data.done;
        const remaining = data.todo + data.inProgress;
        const risk = (remaining / total) * 100;
        
        if (risk < 30) return '🟢 Low';
        if (risk < 60) return '🟡 Medium';
        return '🔴 High';
    }

    getRecommendations(rate, data) {
        if (rate >= 75) {
            return `✓ Prepare for sprint review and demo
✓ Document successful practices
✓ Begin planning next sprint`;
        } else if (rate >= 50) {
            return `→ Maintain current workflow
→ Focus on completing in-progress items
→ Monitor blockers daily`;
        } else {
            return `! Prioritize critical path items
! Address blockers immediately
! Consider scope adjustment`;
        }
    }

    async showInputForm(title) {
        if (document.getElementById('sprintForm')) {
            console.log("Form already open, preventing duplicate");
            this.showNotification('⚠️ Form is already open', 'warning');
            return Promise.reject(new Error('Form already open'));
        }
        
        // Initialize validator
        const validator = new InputValidator();
        
        return new Promise((resolve, reject) => {
            const form = document.createElement('div');
            form.innerHTML = `
                <div id="sprintForm" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 24px; border-radius: 16px; z-index: 10000; box-shadow: 0 20px 60px rgba(0,0,0,0.3); border: 1px solid #e1e5e9; font-family: 'Segoe UI', system-ui, sans-serif; min-width: 450px; max-width: 90vw;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 16px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; cursor: move;" id="formHeader">
                        <h3 style="margin: 0; color: white; font-size: 18px; font-weight: 600;">📊 ${title}</h3>
                        <button id="closeForm" style="background: none; border: none; font-size: 20px; cursor: pointer; color: white;">×</button>
                    </div>
                    
                    <!-- Error Display Area -->
                    <div id="errorDisplay" style="display: none; margin-bottom: 16px; padding: 12px; background: #fee; border: 2px solid #f88; border-radius: 8px; color: #c33;">
                        <div style="font-weight: 600; margin-bottom: 4px;">❌ Validation Errors:</div>
                        <div id="errorList" style="font-size: 13px; line-height: 1.6;"></div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2d3748; font-size: 14px;">Sprint Name:</label>
                        <input type="text" id="sprintName" value="Sprint ${new Date().getMonth() + 1}" placeholder="Enter sprint name (optional)" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; box-sizing: border-box; transition: border-color 0.2s;" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#e2e8f0'">
                        <small style="color: #718096; font-size: 12px; margin-top: 4px; display: block;">Leave empty to use default name</small>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2d3748; font-size: 13px;">📋 To Do:</label>
                            <input type="number" id="todoCount" value="8" min="0" max="500" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; font-size: 16px; font-weight: 600;" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#e2e8f0'">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2d3748; font-size: 13px;">🔄 In Progress:</label>
                            <input type="number" id="inProgressCount" value="3" min="0" max="500" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; font-size: 16px; font-weight: 600;" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#e2e8f0'">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2d3748; font-size: 13px;">✅ Done:</label>
                            <input type="number" id="doneCount" value="12" min="0" max="500" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; font-size: 16px; font-weight: 600;" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#e2e8f0'">
                        </div>
                    </div>
                    
                    <div style="background: #f0f9ff; padding: 10px 14px; border-radius: 6px; border-left: 4px solid #3b82f6; margin-bottom: 16px; font-size: 12px; color: #1e40af;">
                        <strong>💡 Tip:</strong> Values must be between 0 and 500. Negative numbers will be treated as 0.
                    </div>
                    
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button id="cancelForm" style="padding: 12px 28px; background: #e2e8f0; color: #2d3748; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s;">Cancel</button>
                        <button id="submitForm" style="padding: 12px 28px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); transition: all 0.2s;">Generate</button>
                    </div>
                </div>
                <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; backdrop-filter: blur(4px);" id="overlay"></div>
            `;
            
            document.body.appendChild(form);

            const formElement = form.querySelector('#sprintForm');
            const header = form.querySelector('#formHeader');
            this.makeDraggable(formElement, header);

            const closeForm = () => {
                if (document.body.contains(form)) {
                    document.body.removeChild(form);
                }
                reject(new Error('User cancelled'));
            };

            form.querySelector('#closeForm').onclick = closeForm;
            form.querySelector('#overlay').onclick = closeForm;
            form.querySelector('#cancelForm').onclick = closeForm;
            
            const submitBtn = form.querySelector('#submitForm');
            submitBtn.onmouseenter = () => submitBtn.style.transform = 'translateY(-2px)';
            submitBtn.onmouseleave = () => submitBtn.style.transform = 'translateY(0)';
            
            // SUBMIT WITH VALIDATION
            form.querySelector('#submitForm').onclick = () => {
                const userData = {
                    sprintName: form.querySelector('#sprintName').value,
                    todo: form.querySelector('#todoCount').value,
                    inProgress: form.querySelector('#inProgressCount').value,
                    done: form.querySelector('#doneCount').value
                };
                
                // VALIDATE INPUT
                const validation = validator.validateSprintInput(userData);
                
                if (!validation.isValid) {
                    // SHOW ERRORS
                    const errorDisplay = form.querySelector('#errorDisplay');
                    const errorList = form.querySelector('#errorList');
                    errorDisplay.style.display = 'block';
                    errorList.innerHTML = validation.errors.map(err => `• ${err}`).join('<br>');
                    
                    // Shake animation for error
                    formElement.style.animation = 'shake 0.5s';
                    setTimeout(() => formElement.style.animation = '', 500);
                    
                    return;
                }
                
                // SHOW WARNINGS IF ANY
                if (validation.warnings.length > 0) {
                    console.log('Warnings:', validation.warnings);
                }
                
                // PROCEED WITH VALIDATED DATA
                if (document.body.contains(form)) {
                    document.body.removeChild(form);
                }
                resolve(validation.validatedData);
            };

            // Add shake animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translate(-50%, -50%) translateX(0); }
                    25% { transform: translate(-50%, -50%) translateX(-10px); }
                    75% { transform: translate(-50%, -50%) translateX(10px); }
                }
            `;
            document.head.appendChild(style);
        });
    }

    makeDraggable(element, dragHandle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        dragHandle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // RESULTS DISPLAY
    showResults(content, title, source, sprintData) {
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `
            <div id="resultModal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 24px; border-radius: 16px; z-index: 10000; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 700px; max-height: 85vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 16px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px;">
                    <h3 style="margin: 0; color: white; font-size: 18px; font-weight: 600;">📊 ${title}</h3>
                    <button id="closeResult" style="background: none; border: none; font-size: 22px; cursor: pointer; color: white;">×</button>
                </div>
                
                <div style="margin-bottom: 16px; padding: 10px 14px; background: #e8f4fd; border-radius: 6px; border-left: 4px solid #1890ff;">
                    <small style="color: #1890ff; font-weight: 600;">Source: ${source}</small>
                </div>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                    <pre style="white-space: pre-wrap; font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace; font-size: 13px; line-height: 1.6; margin: 0; color: #2d3748;">${content}</pre>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
                    <button id="copyResult" style="padding: 12px 16px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
                        📋 Copy Text
                    </button>
                    <button id="exportPDF" style="padding: 12px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
                        📄 Export PDF
                    </button>
                    <button id="exportCSV" style="padding: 12px 16px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
                        📊 Export CSV
                    </button>
                    <button id="closeResultBtn" style="padding: 12px 16px; background: #6b7280; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
                        ✕ Close
                    </button>
                </div>
            </div>
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; backdrop-filter: blur(4px);" id="resultOverlay"></div>
        `;
        
        document.body.appendChild(resultDiv);

        const closeModal = () => document.body.removeChild(resultDiv);
        
        resultDiv.querySelector('#closeResult').onclick = closeModal;
        resultDiv.querySelector('#closeResultBtn').onclick = closeModal;
        resultDiv.querySelector('#resultOverlay').onclick = closeModal;

        resultDiv.querySelector('#copyResult').onclick = async () => {
            await this.copyToClipboard(content);
            this.showNotification('📋 Copied to clipboard!', 'success');
        };

        resultDiv.querySelector('#exportPDF').onclick = () => {
            this.exportToPDF(content, sprintData);
        };

        resultDiv.querySelector('#exportCSV').onclick = () => {
            this.exportToCSV(sprintData);
        };

        const buttons = resultDiv.querySelectorAll('button:not(#closeResult)');
        buttons.forEach(btn => {
            btn.onmouseenter = () => btn.style.transform = 'translateY(-2px)';
            btn.onmouseleave = () => btn.style.transform = 'translateY(0)';
        });
    }
  
    // SHARING OPTIONS 
    async showSharingOptions() {
        // PREVENT DUPLICATE DIALOGS with better detection
        if (document.querySelector('#sharingDialog') || document.querySelector('#sharingOverlay')) {
            console.log("Export dialog already open, preventing duplicate");
            this.showNotification('⚠️ Export dialog is already open', 'warning');
            return Promise.reject(new Error('Dialog already open'));
        }
        
        return new Promise((resolve, reject) => {
            let dialogRemoved = false;
            
            const safeRemoveDialog = () => {
                if (!dialogRemoved && document.body.contains(dialog)) {
                    document.body.removeChild(dialog);
                    dialogRemoved = true;
                }
            };

            const dialog = document.createElement('div');
            dialog.innerHTML = `
                <div id="sharingDialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 24px; border-radius: 16px; z-index: 10000; box-shadow: 0 20px 60px rgba(0,0,0,0.3); border: 1px solid #e1e5e9; font-family: 'Segoe UI', system-ui, sans-serif; min-width: 400px;">
                    <div style="margin-bottom: 20px; padding: 16px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px;">
                        <h3 style="margin: 0; color: white; font-size: 18px; font-weight: 600;">📤 Export Options</h3>
                    </div>
                    
                    <div style="display: grid; gap: 12px; margin-bottom: 20px;">
                        <button class="shareOption" data-action="copy" style="padding: 16px; background: #10b981; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 10px; transition: all 0.2s;">
                            <span style="font-size: 24px;">📋</span>
                            <span>Copy to Clipboard</span>
                        </button>
                        
                        <button class="shareOption" data-action="pdf" style="padding: 16px; background: #ef4444; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 10px; transition: all 0.2s;">
                            <span style="font-size: 24px;">📄</span>
                            <span>Export as PDF</span>
                        </button>
                        
                        <button class="shareOption" data-action="csv" style="padding: 16px; background: #3b82f6; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 10px; transition: all 0.2s;">
                            <span style="font-size: 24px;">📊</span>
                            <span>Export as CSV</span>
                        </button>
                        
                        <button class="shareOption" data-action="gmail" style="padding: 16px; background: #ea4335; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 10px; transition: all 0.2s;">
                            <span style="font-size: 24px;">📧</span>
                            <span>Send via Gmail</span>
                        </button>
                        
                        <button class="shareOption" data-action="outlook" style="padding: 16px; background: #0078d4; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 10px; transition: all 0.2s;">
                            <span style="font-size: 24px;">📮</span>
                            <span>Send via Outlook</span>
                        </button>
                    </div>
                    
                    <button id="cancelSharing" style="width: 100%; padding: 12px; background: #e2e8f0; color: #2d3748; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s;">
                        Cancel
                    </button>
                </div>
                <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; backdrop-filter: blur(4px);" id="sharingOverlay"></div>
            `;
            
            document.body.appendChild(dialog);

            const closeDialog = (result = null) => {
                safeRemoveDialog();
                if (result === null) {
                    resolve('cancelled');
                } else {
                    resolve(result);
                }
            };

            // SINGLE event handler for cancel
            const cancelBtn = dialog.querySelector('#cancelSharing');
            const overlay = dialog.querySelector('#sharingOverlay');
            
            const cancelHandler = () => closeDialog();
            cancelBtn.onclick = cancelHandler;
            overlay.onclick = cancelHandler;

            // SINGLE event handler for options
            const buttons = dialog.querySelectorAll('.shareOption');
            buttons.forEach(btn => {
                btn.onmouseenter = () => btn.style.transform = 'translateY(-2px)';
                btn.onmouseleave = () => btn.style.transform = 'translateY(0)';
                
                btn.onclick = (e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    const action = btn.getAttribute('data-action');
                    closeDialog(action);
                };
            });

            // Safety timeout - auto cleanup if something goes wrong
            setTimeout(() => {
                if (!dialogRemoved && document.body.contains(dialog)) {
                    console.warn('Dialog auto-cleanup triggered');
                    safeRemoveDialog();
                    reject(new Error('Dialog timeout'));
                }
            }, 30000); // 30 second timeout
        });
    }

    // COPY TO CLIPBOARD
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            } catch (err2) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    }

    // OPEN IN EMAIL APP
    openInApp(content, app) {
        const subject = encodeURIComponent('Sprint Status Update');
        const body = encodeURIComponent(content);
        
        if (app === 'gmail') {
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank');
        } else if (app === 'outlook') {
            window.open(`https://outlook.live.com/mail/0/deeplink/compose?subject=${subject}&body=${body}`, '_blank');
        }
        
        this.showNotification('Opening email client...', 'info');
    }

    // EXPORT TO PDF - Using native browser print with auto-save
    exportToPDF(content, sprintData) {
        try {
            const sprintName = sprintData.sprintName || 'Sprint Report';
            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `${sprintName.replace(/\s+/g, '_')}_${timestamp}`;
            
            // Create a new window with the content
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            
            if (!printWindow) {
                this.showNotification('❌ Please allow popups for this site', 'error');
                return;
            }
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>${filename}</title>
                    <style>
                        @page { 
                            size: A4; 
                            margin: 15mm;
                        }
                        * { 
                            margin: 0; 
                            padding: 0; 
                            box-sizing: border-box; 
                        }
                        body {
                            font-family: 'Segoe UI', Arial, sans-serif;
                            line-height: 1.6;
                            color: #2d3748;
                            padding: 20px;
                            background: white;
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea, #764ba2);
                            color: white;
                            padding: 20px;
                            border-radius: 10px;
                            margin-bottom: 20px;
                            page-break-inside: avoid;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                            color: white;
                        }
                        .header .date {
                            margin-top: 5px;
                            opacity: 0.9;
                            font-size: 13px;
                        }
                        .content {
                            background: #f8fafc;
                            padding: 20px;
                            border-radius: 10px;
                            border: 1px solid #e2e8f0;
                            margin-bottom: 20px;
                        }
                        pre {
                            white-space: pre-wrap;
                            word-wrap: break-word;
                            font-family: 'Courier New', 'Consolas', monospace;
                            font-size: 11px;
                            line-height: 1.5;
                            margin: 0;
                        }
                        .footer {
                            margin-top: 30px;
                            padding-top: 15px;
                            border-top: 2px solid #e2e8f0;
                            text-align: center;
                            color: #718096;
                            font-size: 11px;
                            page-break-inside: avoid;
                        }
                        .footer strong {
                            color: #667eea;
                        }
                        .no-print {
                            position: fixed;
                            top: 10px;
                            right: 10px;
                            padding: 12px 24px;
                            background: #667eea;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 14px;
                            font-weight: 600;
                            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                            z-index: 1000;
                        }
                        .no-print:hover {
                            background: #5568d3;
                        }
                        .instructions {
                            position: fixed;
                            top: 60px;
                            right: 10px;
                            padding: 12px 16px;
                            background: #fffbeb;
                            border: 2px solid #fbbf24;
                            border-radius: 8px;
                            font-size: 12px;
                            max-width: 300px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                            z-index: 1000;
                        }
                        .instructions strong {
                            display: block;
                            margin-bottom: 8px;
                            color: #92400e;
                        }
                        .instructions ol {
                            margin-left: 20px;
                            color: #92400e;
                        }
                        .instructions li {
                            margin: 4px 0;
                        }
                        @media print {
                            body { 
                                padding: 0; 
                            }
                            .no-print, .instructions { 
                                display: none !important; 
                            }
                            .header {
                                background: #667eea !important;
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                            .content {
                                background: #f8fafc !important;
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                        }
                    </style>
                </head>
                <body>
                    <button class="no-print" onclick="window.print()">🖨️ Save as PDF</button>
                    
                    <div class="instructions no-print">
                        <strong>📄 How to Save as PDF:</strong>
                        <ol>
                            <li>Click the button above</li>
                            <li>Select "Save as PDF" as destination</li>
                            <li>Click "Save"</li>
                        </ol>
                        <div style="margin-top: 8px; font-size: 11px; color: #78716c;">
                            Suggested filename: <strong>${filename}.pdf</strong>
                        </div>
                    </div>
                    
                    <div class="header">
                        <h1>📊 ${sprintName}</h1>
                        <div class="date">Generated: ${new Date().toLocaleString()}</div>
                    </div>
                    <div class="content">
                        <pre>${content}</pre>
                    </div>
                    <div class="footer">
                        <p>AI-Powered Sprint Analytics & Reporting</p>
                    </div>
                </body>
                </html>
            `);
            
            printWindow.document.close();
            
            this.showNotification('📄 PDF preview opened - Click "Save as PDF" button', 'success');
            
        } catch (error) {
            console.error('PDF Export Error:', error);
            this.showNotification('❌ PDF export failed', 'error');
        }
    }

// EXPORT TO CSV
    exportToCSV(sprintData) {
        try {
            const csvContent = [
                ['Sprint Report', ''],
                ['Generated', new Date().toLocaleString()],
                ['', ''],
                ['Sprint Name', sprintData.sprintName],
                ['', ''],
                ['Status', 'Count'],
                ['To Do', sprintData.todo],
                ['In Progress', sprintData.inProgress],
                ['Done', sprintData.done],
                ['Total', sprintData.todo + sprintData.inProgress + sprintData.done],
                ['', ''],
                ['Metrics', 'Value'],
                ['Completion Rate', `${Math.round((sprintData.done / (sprintData.todo + sprintData.inProgress + sprintData.done)) * 100)}%`],
                ['Velocity', `${Math.round(sprintData.done / 2)} points/week`],
                ['Remaining Issues', sprintData.todo + sprintData.inProgress]
            ];

            const csv = csvContent.map(row => row.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `${sprintData.sprintName.replace(/\s+/g, '_')}_Report.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('📊 CSV exported successfully!', 'success');
        } catch (error) {
            console.error('CSV Export Error:', error);
            this.showNotification('❌ CSV export failed', 'error');
        }
    }

    // NOTIFICATION SYSTEM
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        
        const colors = {
            success: { bg: '#10b981', icon: '✅' },
            error: { bg: '#ef4444', icon: '❌' },
            warning: { bg: '#f59e0b', icon: '⚠️' },
            info: { bg: '#3b82f6', icon: 'ℹ️' }
        };
        
        const style = colors[type] || colors.info;
        
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: ${style.bg}; color: white; padding: 16px 24px; border-radius: 10px; z-index: 10001; box-shadow: 0 10px 30px rgba(0,0,0,0.3); font-family: 'Segoe UI', system-ui, sans-serif; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 10px; animation: slideIn 0.3s ease-out;">
                <span style="font-size: 20px;">${style.icon}</span>
                <span>${message}</span>
            </div>
            <style>
                @keyframes slideIn {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(400px); opacity: 0; }
                }
            </style>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.firstElementChild.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

}

// ENHANCED INPUT VALIDATION MODULE
// Addresses: negative numbers, huge values, empty sprint name

class InputValidator {
    constructor() {
        this.MAX_ISSUE_COUNT = 500;  // Maximum realistic issue count per field
        this.MIN_ISSUE_COUNT = 0;
        this.WARNING_THRESHOLD = 200; // Show warning above this
    }

    // Validate sprint data input
    validateSprintInput(sprintData) {
        const errors = [];
        const warnings = [];

        // 1. SPRINT NAME VALIDATION
        const sprintName = this.validateSprintName(sprintData.sprintName);
        if (sprintName.hasDefault) {
            warnings.push('Using default sprint name');
        }

        // 2. NUMERIC FIELDS VALIDATION
        const todo = this.validateIssueCount(sprintData.todo, 'To Do');
        const inProgress = this.validateIssueCount(sprintData.inProgress, 'In Progress');
        const done = this.validateIssueCount(sprintData.done, 'Done');

        // Collect validation errors
        if (todo.error) errors.push(todo.error);
        if (inProgress.error) errors.push(inProgress.error);
        if (done.error) errors.push(done.error);

        // 3. CHECK FOR ALL ZEROS
        const total = todo.value + inProgress.value + done.value;
        if (total === 0) {
            errors.push('At least one issue count must be greater than 0');
        }

        // 4. WARNING FOR LARGE BUT VALID NUMBERS
        if (total > this.WARNING_THRESHOLD && total <= this.MAX_ISSUE_COUNT * 3) {
            warnings.push(`Large sprint detected (${total} total issues). Consider breaking into smaller sprints.`);
        }

        // 5. WARNING FOR INDIVIDUAL FIELD THRESHOLDS
        if (todo.value > this.WARNING_THRESHOLD && todo.value <= this.MAX_ISSUE_COUNT) {
            warnings.push(`To Do count is high (${todo.value} issues)`);
        }
        if (inProgress.value > this.WARNING_THRESHOLD && inProgress.value <= this.MAX_ISSUE_COUNT) {
            warnings.push(`In Progress count is high (${inProgress.value} issues)`);
        }
        if (done.value > this.WARNING_THRESHOLD && done.value <= this.MAX_ISSUE_COUNT) {
            warnings.push(`Done count is high (${done.value} issues)`);
        }

        // Return validation result
        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            validatedData: {
                sprintName: sprintName.value,
                todo: todo.value,
                inProgress: inProgress.value,
                done: done.value
            }
        };
    }

    // Validate sprint name
    validateSprintName(name) {
        const trimmedName = (name || '').trim();
        
        if (!trimmedName || trimmedName.length === 0) {
            return {
                value: `Sprint ${new Date().getMonth() + 1}`,
                hasDefault: true
            };
        }

        // Check for excessive length
        if (trimmedName.length > 100) {
            return {
                value: trimmedName.substring(0, 100),
                hasDefault: false,
                warning: 'Sprint name truncated to 100 characters'
            };
        }

        // Sanitize sprint name (remove special characters that could cause issues)
        const sanitizedName = trimmedName.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '');
        
        if (sanitizedName.length === 0) {
            return {
                value: `Sprint ${new Date().getMonth() + 1}`,
                hasDefault: true
            };
        }

        return {
            value: sanitizedName,
            hasDefault: false
        };
    }

    // Validate issue count
    validateIssueCount(value, fieldName) {
        // Convert to string first to handle edge cases
        const stringValue = String(value).trim();
        
        // 1. CHECK FOR EMPTY INPUT
        if (stringValue === '' || stringValue === null || stringValue === undefined) {
            return {
                value: 0,
                error: `${fieldName}: Cannot be empty (set to 0)`
            };
        }

        // 2. PARSE THE VALUE
        let numValue = Number(stringValue);

        // 3. CHECK FOR INVALID INPUT (NaN)
        if (isNaN(numValue) || !isFinite(numValue)) {
            return {
                value: 0,
                error: `${fieldName}: Invalid number format (set to 0)`
            };
        }

        // 4. CHECK FOR DECIMAL NUMBERS (round to integer)
        if (numValue % 1 !== 0) {
            const rounded = Math.round(numValue);
            return {
                value: rounded,
                error: `${fieldName}: Decimal value ${numValue} rounded to ${rounded}`
            };
        }

        // 5. CHECK FOR NEGATIVE NUMBERS
        if (numValue < this.MIN_ISSUE_COUNT) {
            return {
                value: 0,
                error: `${fieldName}: Negative values not allowed (set to 0)`
            };
        }

        // 6. CHECK FOR VERY LARGE NUMBERS
        if (numValue > this.MAX_ISSUE_COUNT) {
            return {
                value: 0,
                error: `${fieldName}: Value ${numValue} exceeds maximum of ${this.MAX_ISSUE_COUNT} (set to 0)`
            };
        }

        // 7. VALID INPUT
        return {
            value: Math.floor(numValue), // Ensure integer
            error: null
        };
    }

    // Format validation errors for display
    formatErrors(errors) {
        if (errors.length === 0) return '';
        
        return errors.map((error, index) => `${index + 1}. ${error}`).join('\n');
    }

    // Format warnings for display
    formatWarnings(warnings) {
        if (warnings.length === 0) return '';
        
        return warnings.map((warning, index) => `⚠️ ${warning}`).join('\n');
    }
}

// Initialize the extension
const sprintSynapse = new SprintSynapse();
window.sprintSynapse = sprintSynapse;

// Message listener for extension communication
if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log("Message received:", request);
        
        if (request.action === 'checkJiraPage') {
            sendResponse({ isJira: sprintSynapse.isJiraPage() });
            return true;
        }
        
        if (request.action === 'generateSummary') {
            sprintSynapse.generateSummary()
                .then(result => sendResponse(result))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true;
        }
        
        if (request.action === 'generateStatusUpdate') {
            sprintSynapse.generateStatusUpdate()
                .then(result => sendResponse(result))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true;
        }
    });
}

console.log("SprintSynapse - Chrome Built-in AI Ready!");