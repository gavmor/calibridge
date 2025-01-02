# calibridge (🚧 incomplete 🚧)

## Usage
```
Usage: calibridge [options] [command]

Synchronize your Goodreads to-read list with Calibre OPDS and Datasette API.

Options:
  -V, --version        output the version number
  -h, --help           display help for command

Commands:
  remainder [options]  Get the difference between the OPDS and Goodreads CSV
                       files and create a "search_plan.csv".
  plan [options]       Create a synchronization plan based on the search plan
                       CSV file.
  provision [options]  Execute the previously created synchronization plan.
  help [command]       display help for command
```

