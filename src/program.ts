import { Command } from "commander";
import { plan } from "./plan";
import { provision } from "./provision";

const program = new Command();

program
    .name('calibridge')
    .description('Synchronize your Goodreads to-read list with Calibre OPDS and Datasette API.')
    .version('1.0.0');

program
    .command('plan')
    .description('Create a synchronization plan based on the Goodreads and Calibre OPDS files.')
    .option('--goodreads <file>', 'Specify the path to the Goodreads to-read list file (in JSON format).')
    .option('--calibre <file>', 'Specify the path to the Calibre OPDS file (in JSON format).')
    .option('--output <file>', 'Specify the output CSV file for the download plan (default: download_plan.csv).', 'download_plan.csv')
    .option('--datasette-url <url>', 'Specify the base URL for the Datasette API (default: https://example-datasette-api.com).', 'https://example-datasette-api.com')
    .option('--verbose', 'Enable verbose logging for detailed output.')
    .action(plan);

program
    .command('provision')
    .description('Execute the previously created synchronization plan.')
    .option('--plan <file>', 'Specify the path to the previously created CSV download plan.')
    .option('--dry-run', 'Perform a dry run without making any changes (useful for testing).')
    .action(provision);

export { program };