import { Command } from "commander";
import { foo } from "./foo";

export const program = new Command();
program
    .command('foo')
    .argument('bar', 'An argument')
    .option('-q, --qux', 'An option')
    .action(foo);