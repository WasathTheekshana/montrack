# Contributing to Montrack

Thank you for taking the time to contribute! Here is how to get started.

## Development setup

```bash
git clone https://github.com/WasathTheekshana/montrack.git
cd montrack
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Workflow

1. Fork the repo and create a branch from `main`:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes and verify everything passes:

   ```bash
   yarn build
   yarn lint
   yarn typecheck
   ```

3. Open a pull request against `main` and fill in the template.

## Guidelines

- Keep pull requests focused - one feature or fix per PR.
- Write clear commit messages using conventional prefixes: `feat:`, `fix:`, `chore:`, `docs:`.
- Do not introduce new dependencies without opening a discussion issue first.
- Respect the brutalist design language - yellow (`#FFE135`), pink (`#FF2D78`), lime (`#ADFF2F`), black borders, bold type.
- All data must remain in `localStorage`. Do not add server-side storage or authentication.
- Use `yarn` exclusively - do not commit `package-lock.json`.

## What to work on

Check the [open issues](https://github.com/WasathTheekshana/montrack/issues) for things labeled `good first issue` or `help wanted`.

## Reporting bugs

Open an issue using the **Bug report** template. Include steps to reproduce, your OS, and browser version.

## Suggesting features

Open an issue using the **Feature request** template. Describe the use case, not just the solution.

## Code of conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). Be kind.
