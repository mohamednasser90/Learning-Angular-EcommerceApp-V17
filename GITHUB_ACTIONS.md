# GitHub Actions Documentation

## Overview
This project includes two GitHub Actions workflows to enhance development workflow with automated code review and Claude AI assistance.

## Workflows

### 1. Pull Request Review (`pr-review.yml`)

**Purpose:** Automatically reviews pull requests with comprehensive checks and AI-powered code review.

**Triggers:**
- Pull request opened
- Pull request synchronized (new commits)
- Pull request reopened

**Features:**
- ✅ Runs linting checks
- ✅ Executes test suite
- ✅ Builds the project
- 🤖 Claude AI code review focusing on:
  - Code quality and best practices
  - Angular-specific patterns and conventions
  - Security vulnerabilities
  - Performance considerations
  - Test coverage
  - Documentation needs

**Setup Requirements:**
- Repository secret: `ANTHROPIC_API_KEY`

### 2. Claude Assistance (`claude-assistance.yml`)

**Purpose:** Provides on-demand AI assistance when tagged in comments.

**Triggers:**
- Issue comments containing `@claude` or `@Claude`
- Pull request review comments containing `@claude` or `@Claude`

**Features:**
- 🎯 Context-aware responses for Angular 17 projects
- 📚 Guidance on:
  - Angular best practices
  - TypeScript patterns
  - Component architecture
  - Routing solutions
  - Testing strategies
  - Performance optimization

**Usage Examples:**
```
@claude How should I structure my components for this feature?
@claude What's the best way to handle form validation in Angular 17?
@claude Can you review this routing configuration?
```

## Setup Instructions

### 1. Repository Secrets Configuration
1. Go to repository Settings
2. Navigate to "Secrets and variables" > "Actions"
3. Add new secret:
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key

### 2. Permissions
The workflows are configured with minimal required permissions:
- `contents: read` - Access repository code
- `pull-requests: write` - Comment on PRs
- `issues: write` - Comment on issues

### 3. Node.js Dependencies
Ensure your `package.json` includes these scripts:
```json
{
  "scripts": {
    "lint": "ng lint",
    "test": "ng test",
    "build": "ng build"
  }
}
```

## Workflow Status
- ✅ PR Review Action: Configured and ready
- ✅ Claude Assistance Action: Configured and ready
- ⚠️ Requires: `ANTHROPIC_API_KEY` secret setup

## Troubleshooting

### Common Issues
1. **Missing API Key**: Add `ANTHROPIC_API_KEY` to repository secrets
2. **Script Errors**: Ensure npm scripts exist in `package.json`
3. **Permission Errors**: Verify workflow permissions in repository settings

### Logs Location
- Actions tab in GitHub repository
- Individual workflow run details
- Step-by-step execution logs

## Implementation Todos
- ☒ Create GitHub Action for automated PR review
- ☒ Create GitHub Action for tagging Claude assistance
- ☒ Create .github/workflows directory if it doesn't exist
- ☒ Create documentation for GitHub Actions workflows
- ☒ Add issue trigger to Claude assistance workflow

## Review Checklist
- [ ] Workflows trigger correctly on PR events
- [ ] Claude assistance responds to @mentions
- [ ] API key is properly configured
- [ ] Npm scripts execute without errors
- [ ] Code review feedback is helpful and relevant
- [ ] Performance impact is acceptable
- [ ] Security permissions are minimal and appropriate