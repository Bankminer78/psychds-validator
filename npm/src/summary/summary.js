export class Summary {
    totalFiles;
    size;
    dataProcessed;
    dataTypes;
    schemaVersion;
    suggestedColumns;
    constructor() {
        this.dataProcessed = false;
        this.totalFiles = -1;
        this.size = 0;
        this.dataTypes = new Set();
        this.schemaVersion = '';
        this.suggestedColumns = [];
    }
    async update(context) {
        if (context.file.path.startsWith('/derivatives') && !this.dataProcessed) {
            return;
        }
        this.totalFiles++;
        this.size += await context.file.size;
        if (context.datatype.length) {
            this.dataTypes.add(context.datatype);
        }
    }
    formatOutput() {
        return {
            totalFiles: this.totalFiles,
            size: this.size,
            dataProcessed: this.dataProcessed,
            dataTypes: Array.from(this.dataTypes),
            schemaVersion: this.schemaVersion,
            suggestedColumns: this.suggestedColumns
        };
    }
}
