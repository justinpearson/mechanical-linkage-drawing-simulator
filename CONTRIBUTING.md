Thank you for contributing to this project.

This project uses the following software development conventions:

- AI code generation (FOR HUMANS:) For tracking major AI-generated features, before you prompt the AI agent, please prepend the contents of `system-prompt.txt` to your initial prompt. This instructs the AI to save your initial prompt in the `prompts/` directory with the naming convention `YYYY-MM-DD-HH-MM-SS_BRANCH_NAME.txt`. This sequence of prompts may be useful in a world where most of the human labor goes into determining the prompts, rather than writing the actual source code.

- When creating a new Pull Request, if an AI composed the PR's description, the description MUST start with "*Note: this PR description was composed by AI.*"

- Git commit messages adhere to the "Conventional Commits" specification, eg, "feat: add components for Wheel and Rod objects"
    - https://www.conventionalcommits.org/en/v1.0.0/

- Favor a feature-oriented workflow:
    - each major feature in its own git branch
    - small atomic commits within each branch
    - helpful & human readble commit messages that refer to end-user functionality and call out any subtleties / potential confusions


------------------------------

# TODO: consider these conventions too:


- semver semantic versioning convention, eg, MAJOR.MINOR.PATCH

- Use a "rebase" based git workflow, not "merge" based.


- test-driven development
    - write tests before writing the production code
    - ensure tests pass before each commit

- use eslint and configure to run upon pre-commit
