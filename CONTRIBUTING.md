Thank you for contributing to this project.

This project uses the following software development conventions:

- AI code generation
	- (FOR HUMANS:) For tracking major AI-generated features, before you prompt the AI agent, please prepend the contents of `system-prompt.txt` to your initial prompt. This instructs the AI to save your initial prompt in the `prompts/` directory with the naming convention `YYYY-MM-DD-HH-MM-SS_BRANCH_NAME.txt`. This sequence of prompts may be useful in a world where most of the human labor goes into determining the prompts, rather than writing the actual source code.


------------------------------

# TODO: consider these conventions too:

- Git commit messages adhere to the "Conventional Commits" specification, eg, "feat: add components for Wheel and Rod objects"
    - https://www.conventionalcommits.org/en/v1.0.0/

- semver semantic versioning convention, eg, MAJOR.MINOR.PATCH

- "rebase" based git workflow, not "merge" based

- feature-based workflow
    - git branch for each feature
    - small atomic commits

- test-driven development
    - write tests before writing the production code
    - ensure tests pass before each commit

- use eslint and configure to run upon pre-commit
