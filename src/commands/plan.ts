import { expect, is, test } from "@benchristel/taste";
import type { FileWriter } from "../util/writeBookCSV";
import { writeBookCSV } from "../util/writeBookCSV";
import type { Command } from "commander";
import { identifyAvailable, isBook } from "../util/identifyMissing";
import { parse as parseCSV } from 'csv-parse/sync';

type PlanOptions = {
    searchPlan: string;
    datasetteUrl: string;
    output: string;
    verbose?: boolean;
};

export async function plan({ output: outputPath, searchPlan: inputPath }:
    PlanOptions, _: Command,
    { writeFileSync, readFileSync }: FileWriter = require('fs')) {
    const candidates = await identifyAvailable(parseCSV(readFileSync(inputPath, 'utf-8')))
    writeBookCSV(candidates, outputPath, { writeFileSync })
}

test(plan.name, {
    async "when no candidates are found, writes an empty CSV"() {
        let contents: string = 'UNWRITTEN'
        let destination: string = 'INDETERMINATE'

        await plan({ searchPlan: 'foo', datasetteUrl: 'foo', output: 'baz' }, {} as Command, {
            writeFileSync(path, data) {
                contents = data
                destination = path
            },
            readFileSync() { }
        })

        expect(contents, is, "title,author,isbn\n")
        expect(destination, is, "baz")
    },
    async "when some candidates are found, writes them to a CSV"() {
        let contents: string = 'UNWRITTEN'
        let destination: string = 'INDETERMINATE'

        await plan({ searchPlan: 'foo', datasetteUrl: 'foo', output: 'baz' }, {} as Command, {
            writeFileSync(path, data) {
                contents = data
                destination = path
            },
            readFileSync() {
                return "title,author,isbn\nstrawberry,chocolate,vanilla"
            }
        })

        expect(contents, is, "title,author,isbn\nstrawberry,chocolate,vanilla")
        expect(destination, is, "baz")
    },
})


