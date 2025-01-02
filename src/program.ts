import { Command } from "commander";
import { plan } from "./commands/plan";
import { provision } from "./commands/provision";
import { remainder } from "./commands/remainder";

const program = new Command();

program
    .name('calibridge')
    .description('Synchronize your Goodreads to-read list with Calibre OPDS and Datasette API.')
    .version('0.0.1');

program
    .command('remainder')
    .description('Get the difference between the OPDS and Goodreads CSV files and create a "search_plan.csv".')
    .requiredOption('--goodreads <file>', 'Specify the path to the Goodreads to-read list file (in CSV format).')
    .requiredOption('--calibre <file>', 'Specify the path to the Calibre OPDS file (in JSON format).')
    .option('--output <file>', 'Specify the output CSV file for the search plan (default: search_plan.csv).', 'search_plan.csv')
    .action(remainder); 

program
    .command('plan')
    .description('Create a synchronization plan based on the search plan CSV file.')
    .requiredOption('--search-plan <file>', 'Specify the path to the search plan CSV file.')
    .option('--output <file>', 'Specify the output CSV file for the download plan (default: download_plan.csv).', 'download_plan.csv')
    .requiredOption('--datasette-url <url>', 'Specify the base URL for the Datasette API.')
    .option('--verbose', 'Enable verbose logging for detailed output.')
    .action(plan);

program
    .command('provision')
    .description('Execute the previously created synchronization plan.')
    .option('--plan <file>', 'Specify the path to the previously created CSV download plan.')
    .option('--dry-run', 'Perform a dry run without making any changes (useful for testing).')
    .action(provision);

export { program };