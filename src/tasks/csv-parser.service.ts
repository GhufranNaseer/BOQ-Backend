import { Injectable, BadRequestException } from '@nestjs/common';
import { Readable } from 'stream';
import * as csv from 'csv-parser';

interface CSVRow {
    'S.no': string;
    Task: string;
    Description: string;
    Name: string;
    Department: string;
}

interface ParsedTask {
    sNo: number;
    taskName: string;
    description: string;
    departmentName: string;
}

@Injectable()
export class CsvParserService {
    private readonly EXPECTED_HEADERS = ['S.no', 'Task', 'Description', 'Name', 'Department'];

    async parseCSV(buffer: Buffer): Promise<ParsedTask[]> {
        return new Promise((resolve, reject) => {
            const tasks: ParsedTask[] = [];
            const errors: string[] = [];
            let rowNumber = 0;

            const stream = Readable.from(buffer);

            stream
                .pipe(csv())
                .on('headers', (csvHeaders: string[]) => {

                    // Strict header validation
                    const headersMatch = this.EXPECTED_HEADERS.every(
                        (header, index) => csvHeaders[index] === header,
                    );

                    if (!headersMatch || csvHeaders.length !== this.EXPECTED_HEADERS.length) {
                        errors.push(
                            `Invalid header format. Expected: "${this.EXPECTED_HEADERS.join('","')}" ` +
                            `but got: "${csvHeaders.join('","')}"`,
                        );
                    }
                })
                .on('data', (row: CSVRow) => {
                    rowNumber++;

                    // Validate row
                    const rowErrors = this.validateRow(row, rowNumber);
                    if (rowErrors.length > 0) {
                        errors.push(...rowErrors);
                        return;
                    }

                    // Parse and add task
                    tasks.push({
                        sNo: parseInt(row['S.no'], 10),
                        taskName: row['Task'].trim(),
                        description: row['Description'].trim(),
                        departmentName: row['Department'].trim(),
                    });
                })
                .on('end', () => {
                    if (errors.length > 0) {
                        reject(
                            new BadRequestException({
                                message: 'CSV validation failed',
                                errors,
                            }),
                        );
                    } else if (tasks.length === 0) {
                        reject(
                            new BadRequestException('CSV file is empty or contains no valid data'),
                        );
                    } else {
                        resolve(tasks);
                    }
                })
                .on('error', (error) => {
                    reject(new BadRequestException(`Error parsing CSV: ${error.message}`));
                });
        });
    }

    private validateRow(row: CSVRow, rowNumber: number): string[] {
        const errors: string[] = [];

        // Check S.no is numeric
        if (!row['S.no'] || isNaN(parseInt(row['S.no'], 10))) {
            errors.push(`Row ${rowNumber}: S.no must be a valid number`);
        }

        // Check all required fields are present and not empty
        if (!row['Task'] || row['Task'].trim() === '') {
            errors.push(`Row ${rowNumber}: Task field is empty`);
        }

        if (!row['Description'] || row['Description'].trim() === '') {
            errors.push(`Row ${rowNumber}: Description field is empty`);
        }

        if (!row['Department'] || row['Department'].trim() === '') {
            errors.push(`Row ${rowNumber}: Department field is empty`);
        }

        return errors;
    }
}
