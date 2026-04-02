# Copilot Instructions

This GitHub Action is a **composite action** that uses the GitHub CLI (`gh`) to
interact with the GitHub GraphQL API. The action logic is contained entirely in
the `action.yml` file as shell scripts, requiring no JavaScript bundling or
compilation steps.

The `main` branch contains the JavaScript implementation, while the `cli` branch
(current) contains the GitHub CLI implementation.

## Repository Structure

| Path                 | Description                                        |
| -------------------- | -------------------------------------------------- |
| `__fixtures__/`      | Unit Test Fixtures (from JavaScript version)      |
| `__tests__/`         | Unit Tests (from JavaScript version)              |
| `.devcontainer/`     | Development Container Configuration                |
| `.github/`           | GitHub Configuration                               |
| `.licenses/`         | License Information                                |
| `.vscode/`           | Visual Studio Code Configuration                   |
| `badges/`            | Badges for readme                                  |
| `dist/`              | Generated JavaScript Code (from JavaScript version)|
| `src/`               | JavaScript Source Code (from JavaScript version)   |
| `.env.example`       | Environment Variables Example                      |
| `.licensed.yml`      | Licensed Configuration                             |
| `.markdown-lint.yml` | Markdown Linter Configuration                      |
| `.node-version`      | Node.js Version Configuration                      |
| `.prettierrc.yml`    | Prettier Formatter Configuration                   |
| `.yaml-lint.yml`     | YAML Linter Configuration                          |
| `action.yml`         | GitHub Action Metadata and Implementation          |
| `CODEOWNERS`         | Code Owners File                                   |
| `eslint.config.mjs`  | ESLint Configuration (from JavaScript version)     |
| `jest.config.js`     | Jest Configuration (from JavaScript version)       |
| `LICENSE`            | License File                                       |
| `package.json`       | NPM Package Configuration (from JavaScript version)|
| `README.md`          | Project Documentation                              |
| `rollup.config.js`   | Rollup Bundler Configuration (from JavaScript version)|

**Note:** Files marked "from JavaScript version" are retained for reference but
are not used in the composite action implementation.

## Development

Since this is a composite action using shell scripts, development is
straightforward:

1. Edit the `action.yml` file directly
2. Test the action in a workflow
3. No bundling or compilation required

## Testing

For testing the composite action, create a test workflow in `.github/workflows/`
that uses the action with various inputs. The JavaScript tests in `__tests__/`
are retained from the previous implementation.

## General Coding Guidelines

- Follow standard shell scripting best practices
- Use proper error handling with `set -e` and error checking
- Document changes clearly and thoroughly
- Use descriptive variable names in UPPERCASE for environment variables
- Validate all inputs before use
- Use GitHub Actions logging commands (`::error::`, `::warning::`, `::debug::`)
  for consistent output
- Keep scripts readable and maintainable
- Use comments to explain complex logic, not obvious operations
- Test changes in a workflow before committing
- Use `jq` for robust JSON parsing
- Quote variables properly to prevent word splitting and globbing
- Avoid unnecessary complexity and always consider the long-term maintainability
  of the code

### Versioning

GitHub Actions are versioned using branch and tag names. Please ensure the
version in the project's `package.json` is updated to reflect the changes made
in the codebase. The version should follow
[Semantic Versioning](https://semver.org/) principles.

## Pull Request Guidelines

When creating a pull request (PR), please ensure that:

- Keep changes focused and minimal (avoid large changes, or consider breaking
  them into separate, smaller PRs)
- Formatting checks pass
- Linting checks pass
- If necessary, the `README.md` file is updated to reflect any changes in
  functionality or usage

The body of the PR should include:

- A summary of the changes
- A special note of any changes to dependencies
- A link to any relevant issues or discussions
- Any additional context that may be helpful for reviewers

## Code Review Guidelines

When performing a code review, please follow these guidelines:

- If there are changes that modify the functionality/usage of the action,
  validate that there are changes in the `README.md` file that document the new
  or modified functionality
