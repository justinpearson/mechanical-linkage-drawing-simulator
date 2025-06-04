# Feature Workflow Process

This rule defines the process to follow when implementing a new feature in this project.

## Initial Setup

1. When receiving a new feature request:
   - Get current timestamp using `date` command
   - Create a new branch with appropriate name (e.g., `addMultiSelect`)
   - Create prompt file in `prompts/` with format: `YYYY-MM-DD-HH-MM-SS_BRANCH_NAME.txt`
   - Copy the feature request prompt verbatim into this file
   - Make initial commit with message: "FEATURE PROMPT: <one-line summary>"

## Implementation Process

1. Make small atomic commits for each logical change
2. Write commit messages to `commit-message.txt` to avoid newline issues
3. Follow conventional commits format:
   - feat: new feature
   - fix: bug fix
   - docs: documentation changes
   - style: formatting changes
   - refactor: code restructuring
   - perf: performance improvements
   - test: test additions/modifications
   - chore: build/auxiliary changes
   - ci: CI configuration changes

## Pull Request Process

1. Use GitHub CLI (`gh`) to create PR
2. Write PR description to `pr-body.txt`
3. Use `--body-file` option when creating PR
4. Include disclaimer: "*Note: this PR description was composed by AI.*"

## Additional Guidelines

- Follow test-driven development when applicable
- Ensure all tests pass before each commit
- Use eslint for code quality checks
- Follow semantic versioning (MAJOR.MINOR.PATCH)
- Use rebase-based git workflow 