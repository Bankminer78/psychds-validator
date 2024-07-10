// Non-schema EMPTY_FILE implementation
export const emptyFile = (_schema, context) => {
    if (context.file.size === 0) {
        context.issues.addSchemaIssue('EmptyFile', [context.file]);
    }
    return Promise.resolve();
};
