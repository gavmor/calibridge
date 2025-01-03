import { expect, is, test } from "@benchristel/taste";
import { writeBookCSV } from "../util/writeBookCSV";
import type { Command } from "commander";
import { identifyAvailable, isBook } from "../util/identifyMissing";
import { parse as parseCSV } from 'csv-parse/sync';
import { hydrateRows } from "./hydrateRows";

type PlanOptions = {
    searchPlan: string;
    datasetteUrl: string;
    output: string;
    verbose?: boolean;
};

export async function plan({ output: outputPath, searchPlan: inputPath, datasetteUrl }:
    PlanOptions, _: Command,
    { writeFileSync, readFileSync } = require('fs')) {
    const candidates = await identifyAvailable(
        hydrateRows(
            parseCSV(
                readFileSync(inputPath, 'utf-8'), { columns: true })
        ),
        new URL(datasetteUrl)
    )
    writeBookCSV(candidates, outputPath, { writeFileSync })
}

test(plan.name, {
    async "when no candidates are found, writes an empty CSV"() {
        let contents: string = 'UNWRITTEN'
        let destination: string = 'INDETERMINATE'

        await plan({ searchPlan: 'foo', datasetteUrl: 'http://example.com', output: 'baz' }, {} as Command, {
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

        await plan({ searchPlan: 'foo', datasetteUrl: 'http://example.com', output: 'baz' }, {} as Command, {
            writeFileSync(path, data) {
                contents = data
                destination = path
            },
            readFileSync() {
                return "Title,Author,ISBN\nstrawberry,chocolate,vanilla"
            }
        })

        expect(contents, is, "title,author,isbn\nstrawberry,chocolate,vanilla")
        expect(destination, is, "baz")
    },
})


