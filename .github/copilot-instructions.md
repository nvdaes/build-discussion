 Copilot Instructions

This GitHub Action is a **composite action** that uses the GitHub CLI (`gh`) to
interact with the GitHub GraphQL API. The action consists of:

- `action.yml`: Composite action metadata and step configuration
- `scripts/create-discussion.sh`: Shell script containing the implementation
  logic

This design requires no JavaScript bundling or compilation steps.

## Version History

The repository has been migrated from a JavaScript/Node.js implementation (v1)
to a GitHub CLI composite action (v2). All legacy files from the JavaScript
version have been removed.

## Repository Structure

| Path                     | Description                              |
| ------------------------ | ---------------------------------------- |
| `.github/`               | GitHub configuration and workflows       |
| `scripts/`               | Shell scripts for action implementation  |
| `.gitattributes`         | Git attributes configuration             |
| `.gitignore`             | Git ignore patterns                      |
| `.markdown-lint.yml`     | Markdown linter configuration            |
| `.pre-commit-config.yaml`| Pre-commit hooks configuration           |
| `.yaml-lint.yml`         | YAML linter configuration                |
| `action.yml`             | GitHub Action metadata                   |
| `actionlint.yml`         | GitHub Actions linter configuration      |
| `LICENSE`                | License file                             |
| `README.md`              | Project documentation                    |

## Development

The action implementation is split between two files:

1. **action.yml**: Defines the composite action metadata, inputs, outputs, and
   steps
1. **scripts/create-discussion.sh**: Contains the shell script logic for
   creating discussions

When developing:

1. Edit `action.yml` to modify inputs, outputs, or step configuration
1. Edit `scripts/create-discussion.sh` to modify the implementation logic
1. Test the action in a workflow (see Testing section)
1. No bundling or compilation required

## Testing

For testing the composite action:

1. Create or use an existing test workflow in `.github/workflows/`
1. Use the action with various inputs to verify functionality
1. Check workflow run logs for proper output and error handling
1. Verify the action works with different repositories and categories

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

GitHub Actions are versioned using Git tags. Version 2.x represents the current
composite action implementation. All versions should follow
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
