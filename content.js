// SprintSynapse - Enhanced Professional Edition with Chrome Built-in AI
console.log("SprintSynapse AI - Enhanced Edition with Chrome Built-in AI Support");

class SprintSynapseProfessional {
    constructor() {
        this.aiCapabilities = {
            summarizer: false,
            writer: false,
            prompt: false,
        };
        this.initialize();
    }

    async initialize() {
        console.log("SprintSynapse Professional initialized");
        
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
                return;
            }

            // Check Summarizer API
            if (aiAPI.summarizer) {
                try {
                    const canSummarize = await aiAPI.summarizer.capabilities();
                    this.aiCapabilities.summarizer = canSummarize.available === 'readily' || canSummarize.available === 'after-download';
                    console.log("Summarizer API available:", this.aiCapabilities.summarizer);
                } catch (e) {
                    console.log("Summarizer API check failed:", e);
                }
            }

            // Check Writer API
            if (aiAPI.writer) {
                try {
                    const canWrite = await aiAPI.writer.capabilities();
                    this.aiCapabilities.writer = canWrite.available === 'readily' || canWrite.available === 'after-download';
                    console.log("Writer API available:", this.aiCapabilities.writer);
                } catch (e) {
                    console.log("Writer API check failed:", e);
                }
            }

            // Check Prompt API (languageModel)
            if (aiAPI.languageModel) {
                try {
                    const canPrompt = await aiAPI.languageModel.capabilities();
                    this.aiCapabilities.prompt = canPrompt.available === 'readily' || canPrompt.available === 'after-download';
                    console.log("Prompt API available:", this.aiCapabilities.prompt);
                } catch (e) {
                    console.log("Prompt API check failed:", e);
                }
            }

            console.log("AI Capabilities:", this.aiCapabilities);
        } catch (error) {
            console.error("Error checking AI capabilities:", error);
        }
    }

    // CHECK IF ON JIRA PAGE
    isJiraPage() {
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;
        
        const isJiraDomain = hostname.includes('jira') || hostname.includes('atlassian');
        const isJiraPath = pathname.includes('/jira/') || pathname.includes('/browse/') || pathname.includes('/secure/');
        const hasJiraElements = document.querySelector('[data-test-id*="jira"]') !== null ||
                               document.querySelector('[class*="jira"]') !== null ||
                               document.querySelector('#jira') !== null ||
                               document.querySelector('[data-testid*="issue"]') !== null;
        
        return isJiraDomain || isJiraPath || hasJiraElements;
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
            console.error("Summary generation error:", error);
            if (error.message !== 'User cancelled' && error.message !== 'Form already open') {
                this.showNotification('Please enter valid sprint details', 'error');
            }
            return { success: false, error: error.message };
        }
    }

    // STATUS UPDATE with Chrome Built-in AI
    async generateStatusUpdate() {
        if (!this.isJiraPage()) {
            this.showNotification('⚠️ This feature only works on Jira pages', 'warning');
            return { success: false, error: "Not on Jira page" };
        }
        
        try {
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
            console.error("Status update error:", error);
            if (error.message !== 'User cancelled' && error.message !== 'Form already open') {
                this.showNotification('Update generation cancelled', 'error');
            }
            return { success: false, error: error.message };
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

[Professional Sprint Analysis - Enhanced Template v2.0]`;

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
The Sprint Team

[Source: Enhanced Professional Template]`;

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

    // INPUT FORM
    async showInputForm(title) {
        if (document.getElementById('sprintForm')) {
            console.log("Form already open, preventing duplicate");
            this.showNotification('⚠️ Form is already open', 'warning');
            return Promise.reject(new Error('Form already open'));
        }
        
        return new Promise((resolve, reject) => {
            const form = document.createElement('div');
            form.innerHTML = `
                <div id="sprintForm" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 24px; border-radius: 16px; z-index: 10000; box-shadow: 0 20px 60px rgba(0,0,0,0.3); border: 1px solid #e1e5e9; font-family: 'Segoe UI', system-ui, sans-serif; min-width: 450px; max-width: 90vw;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 16px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; cursor: move;" id="formHeader">
                        <h3 style="margin: 0; color: white; font-size: 18px; font-weight: 600;">📊 ${title}</h3>
                        <button id="closeForm" style="background: none; border: none; font-size: 20px; cursor: pointer; color: white;">×</button>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2d3748; font-size: 14px;">Sprint Name:</label>
                        <input type="text" id="sprintName" value="Sprint ${new Date().getMonth() + 1}" placeholder="Enter sprint name" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; box-sizing: border-box; transition: border-color 0.2s;" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#e2e8f0'">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2d3748; font-size: 13px;">📋 To Do:</label>
                            <input type="number" id="todoCount" value="8" min="0" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; font-size: 16px; font-weight: 600;" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#e2e8f0'">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2d3748; font-size: 13px;">🔄 In Progress:</label>
                            <input type="number" id="inProgressCount" value="3" min="0" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; font-size: 16px; font-weight: 600;" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#e2e8f0'">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2d3748; font-size: 13px;">✅ Done:</label>
                            <input type="number" id="doneCount" value="12" min="0" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; font-size: 16px; font-weight: 600;" onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#e2e8f0'">
                        </div>
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
            
            form.querySelector('#submitForm').onclick = () => {
                const userData = {
                    sprintName: form.querySelector('#sprintName').value,
                    todo: parseInt(form.querySelector('#todoCount').value) || 0,
                    inProgress: parseInt(form.querySelector('#inProgressCount').value) || 0,
                    done: parseInt(form.querySelector('#doneCount').value) || 0
                };
                
                if (userData.todo + userData.inProgress + userData.done === 0) {
                    this.showNotification('Please enter at least some issues', 'warning');
                    return;
                }
                
                if (document.body.contains(form)) {
                    document.body.removeChild(form);
                }
                resolve(userData);
            };
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
        return new Promise((resolve, reject) => {
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

            const closeDialog = () => {
                document.body.removeChild(dialog);
                reject(new Error('User cancelled'));
            };

            dialog.querySelector('#cancelSharing').onclick = closeDialog;
            dialog.querySelector('#sharingOverlay').onclick = closeDialog;

            const buttons = dialog.querySelectorAll('.shareOption');
            buttons.forEach(btn => {
                btn.onmouseenter = () => btn.style.transform = 'translateY(-2px)';
                btn.onmouseleave = () => btn.style.transform = 'translateY(0)';
                
                btn.onclick = () => {
                    const action = btn.getAttribute('data-action');
                    document.body.removeChild(dialog);
                    resolve(action);
                };
            });
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

    // EXPORT TO PDF
    exportToPDF(content, sprintData) {
        try {
            const printWindow = window.open('', '_blank');
            const sprintName = sprintData.sprintName || 'Sprint Report';
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${sprintName} - Report</title>
                    <style>
                        @page { size: A4; margin: 20mm; }
                        body {
                            font-family: 'Segoe UI', Arial, sans-serif;
                            line-height: 1.6;
                            color: #2d3748;
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        h1 {
                            color: #667eea;
                            border-bottom: 3px solid #667eea;
                            padding-bottom: 10px;
                            margin-bottom: 20px;
                        }
                        pre {
                            background: #f8fafc;
                            padding: 15px;
                            border-radius: 8px;
                            border-left: 4px solid #667eea;
                            overflow-x: auto;
                            white-space: pre-wrap;
                            word-wrap: break-word;
                            font-family: 'Courier New', monospace;
                            font-size: 12px;
                            line-height: 1.5;
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea, #764ba2);
                            color: white;
                            padding: 20px;
                            border-radius: 10px;
                            margin-bottom: 20px;
                        }
                        .footer {
                            margin-top: 30px;
                            padding-top: 15px;
                            border-top: 2px solid #e2e8f0;
                            text-align: center;
                            color: #718096;
                            font-size: 12px;
                        }
                        @media print { body { padding: 0; } .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1 style="margin: 0; color: white; border: none;">📊 ${sprintName}</h1>
                        <p style="margin: 5px 0 0 0; opacity: 0.9;">Generated: ${new Date().toLocaleString()}</p>
                    </div>
                    <pre>${content}</pre>
                    <div class="footer">
                        <p><strong>SprintSynapse Professional Edition</strong></p>
                        <p>AI-Powered Sprint Analytics & Reporting</p>
                    </div>
                    <div class="no-print" style="margin-top: 20px; text-align: center;">
                        <button onclick="window.print()" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; margin-right: 10px;">
                            🖨️ Print / Save as PDF
                        </button>
                        <button onclick="window.close()" style="padding: 12px 24px; background: #e2e8f0; color: #2d3748; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600;">
                            Close
                        </button>
                    </div>
                </body>
                </html>
            `);
            
            printWindow.document.close();
            printWindow.onload = () => {
                setTimeout(() => printWindow.print(), 250);
            };
            
            this.showNotification('📄 PDF export ready - Print dialog opened', 'success');
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

// Initialize the extension
const sprintSynapse = new SprintSynapseProfessional();
window.sprintSynapse = sprintSynapse;

// Message listener for extension communication
if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log("Message received:", request);
        
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

console.log("SprintSynapse Professional - Chrome Built-in AI Ready!");