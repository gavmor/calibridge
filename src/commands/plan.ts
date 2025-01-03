import { expect, is, test } from "@benchristel/taste";
import type { FileWriter } from "../util/writeBookCSV";
import { writeBookCSV } from "../util/writeBookCSV";
import type { Command } from "commander";

type PlanOptions = {
    searchPlan: string;
    datasetteUrl: string;
    output: string;
    verbose?: boolean;
};

export async function plan({ output }: PlanOptions, _: Command, { writeFileSync }: FileWriter = require('fs')) {
    writeBookCSV([], output, { writeFileSync })
}

test(plan.name, {
    "when no candidates are found, writes an empty CSV"() {
        let contents: string = 'UNWRITTEN'
        let destination: string = 'INDETERMINATE'

        plan({ searchPlan: 'foo', datasetteUrl: 'foo', output: 'baz' }, {} as Command, {
            writeFileSync(path, data) {
                contents = data
                destination = path
            }
        })

        expect(contents, is, "title,author,isbn\n")
        expect(destination, is, "baz")
    }
})
