# earthquake

The verbosity settings for the cli

```bash
$ earthquake --help
Usage: earthquake [OPTIONS] <COMMAND>

Commands:
  run   Run earthquake
  db    earthquake database commands
  help  Print this message or the help of the given subcommand(s)

Options:
      --earthquake-db-path <EARTHQUAKE_DB_PATH>
          path to the earthquake libmdbx db

  -h, --help
          Print help (see a summary with '-h')

  -V, --version
          Print version

Display:
  -v, --verbosity...
          Set the minimum log level.

          -v      Errors
          -vv     Warnings
          -vvv    Info
          -vvvv   Debug
          -vvvvv  Traces (warning: very verbose!)

      --quiet
          Silence all log output

      --metrics-port <METRICS_PORT>
          [default: 6923]

      --skip-prometheus
```
