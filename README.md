# Setup Isolated HOME Action

Creates an isolated HOME directory for Go builds on self-hosted runners with automatic cleanup.

## Problem

When running multiple GitHub Actions jobs on self-hosted runners, Go creates read-only cache directories that can cause permission issues. This action:

- Creates a unique, isolated HOME directory for each workflow run
- Automatically cleans up the directory (including read-only Go caches) after the job completes
- Prevents conflicts between parallel workflow runs

## Usage

```yaml
name: Build & Test

on: [push]

jobs:
  test:
    runs-on: [self-hosted, go]
    steps:
      - name: Setup isolated HOME
        uses: dentech-floss/setup-isolated-home-action@v1

      - name: Checkout
        uses: actions/checkout@v4

      - name: Build
        run: go build ./...

      - name: Test
        run: go test ./...

      # Cleanup happens automatically! No need for manual cleanup step.
```

## How it works

1. Creates a unique directory: `$RUNNER_TEMP/go-home-{run_id}-{run_attempt}`
2. Sets `$HOME` environment variable for all subsequent steps
3. Automatically runs cleanup in a post-action hook (even if the job fails)
4. Removes read-only restrictions before deleting the directory

## Outputs

- `isolated-home`: Path to the created isolated HOME directory

## Why is this needed?

Go's module cache creates read-only directories (mode 0555). On self-hosted runners:

- Multiple jobs can conflict if they share the same HOME
- Cleanup fails without removing read-only restrictions
- Runner workspace cleanup can fail, causing subsequent jobs to fail

This action solves all these issues automatically.

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## About

Created and maintained by [Dentech AB](https://github.com/dentechse).
