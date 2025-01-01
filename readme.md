# calibridge

## Usage
```
Usage: calibridge [command] [options]

Calibridge - Synchronize your Goodreads to-read list with Calibre OPDS and Datasette API.

Commands:

  plan                   Create a synchronization plan based on the Goodreads and Calibre OPDS files.
  provision              Execute the previously created synchronization plan.

Options:

  -h, --help             Show help information for a specific command.
  -v, --version          Show the version of Calibridge.
  
For 'plan' command:
  --goodreads <file>     Specify the path to the Goodreads to-read list file (in JSON format).
  --calibre <file>       Specify the path to the Calibre OPDS file (in JSON format).
  --output <file>        Specify the output CSV file for the download plan (default: download_plan.csv).
  --datasette-url <url>  Specify the base URL for the Datasette API (default: https://example-datasette-api.com).
  --verbose              Enable verbose logging for detailed output.
  
For 'provision' command:
  --plan <file>          Specify the path to the previously created CSV download plan.
  --dry-run              Perform a dry run without making any changes (useful for testing).

Examples:

  # Create a synchronization plan
  calibridge plan --goodreads path/to/goodreads.json --calibre path/to/calibre_opds.json

  # Specify output CSV file for the plan
  calibridge plan --goodreads path/to/goodreads.json --calibre path/to/calibre_opds.json --output my_download_plan.csv

  # Use a specific Datasette API URL
  calibridge plan --goodreads path/to/goodreads.json --calibre path/to/calibre_opds.json --datasette-url https://my-datasette-instance.com

  # Execute a previously created download plan
  calibridge provision --plan my_download_plan.csv

  # Perform a dry run when executing
  calibridge provision --plan my_download_plan.csv --dry-run

For more information, visit: https://github.com/yourusername/calibridge

```

