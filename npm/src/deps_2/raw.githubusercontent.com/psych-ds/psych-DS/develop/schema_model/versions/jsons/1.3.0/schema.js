export default {
    "meta": {
        "context": {
            "context": {
                "type": "object",
                "description": "The context defines the vocabulary of properties that objects and rules within the schema can use.",
                "properties": {
                    "schema": {
                        "description": "The psych-DS schema",
                        "type": "object"
                    },
                    "dataset": {
                        "description": "Properties and contents of the entire dataset",
                        "type": "object",
                        "properties": {
                            "dataset_description": {
                                "description": "Contents of /dataset_description.json",
                                "type": "object"
                            },
                            "files": {
                                "description": "List of all files in dataset",
                                "type": "array"
                            },
                            "tree": {
                                "description": "Tree view of all files in dataset",
                                "type": "object"
                            },
                            "ignored": {
                                "description": "Set of ignored files",
                                "type": "array"
                            }
                        }
                    },
                    "path": {
                        "description": "Full path of the current file",
                        "type": "string"
                    },
                    "suffix": {
                        "description": "String following the final '_' in a filename and preceding the '.' of the extension. Used to identify datafiles primarily.",
                        "type": "string"
                    },
                    "extensions": {
                        "description": "Extension of current file including initial dot",
                        "type": "string"
                    },
                    "stem": {
                        "type": "string",
                        "description": "Portion of the filename which excludes the extension."
                    },
                    "level": {
                        "type": "string",
                        "description": "Property describing the severity of a rule, which determines whether it produces an error, warning, etc."
                    },
                    "code": {
                        "type": "string",
                        "description": "Unique code identifying a specific error/warning"
                    },
                    "reason": {
                        "type": "string",
                        "description": "Paragraph accompanying an error/warning that provides context for what may cause it."
                    },
                    "directory": {
                        "type": "boolean",
                        "description": "Indicator for whether a given object is expected to be a directory or a file."
                    },
                    "arbitraryNesting": {
                        "type": "boolean",
                        "description": "Indicator for whether a given file object is allowed to be nested within an arbitrary number of subdirectories."
                    },
                    "usesKeywords": {
                        "type": "boolean",
                        "description": "Indicator for whether a given file object requires keyword formatting."
                    },
                    "nonCanonicalKeywordsAllowed": {
                        "type": "boolean",
                        "description": "Indicator for whether a given file object is required to use only official Psych-DS keywords"
                    },
                    "fileRegex": {
                        "type": "regular expression",
                        "description": "Regular expression defining the legal formatting of a filename."
                    },
                    "baseDir": {
                        "type": "string",
                        "description": "Name of the directory under which the file object is expected to appear."
                    },
                    "fields": {
                        "type": "object",
                        "description": "Set of key/value pairs defining the fields that are expected to occur in a given file object, and whether they are required or recommended."
                    },
                    "namespace": {
                        "type": "string",
                        "description": "URL identifying the required namespace to be used for required fields in the file object. Namespaces are web prefixes that point to ontologies which contain definitions of semantic vocabularies."
                    },
                    "jsonld": {
                        "type": "boolean",
                        "description": "Indicator for whether the given file object is required to be a valid JSON-LD object."
                    },
                    "containsAllColumns": {
                        "type": "boolean",
                        "description": "The metadata object, after all inherited sidecars are accounted for, must contain a 'variableMeasured' property listing at least all of the column headers found in the datafile at hand."
                    },
                    "columnsMatchMetadata": {
                        "type": "boolean",
                        "description": "Each datafile must only use column headers that appear in the 'variableMeasured' property of the compiled metadata object that corresponds to it."
                    },
                    "sidecar": {
                        "description": "Sidecar metadata constructed via the inheritance principle",
                        "type": "object"
                    },
                    "columns": {
                        "description": "CSV columns, indexed by column header, values are arrays with column contents",
                        "type": "object",
                        "additionalProperties": {
                            "type": "array"
                        }
                    },
                    "json": {
                        "description": "Contents of the current JSON file",
                        "type": "object"
                    },
                    "keywords": {
                        "description": "List of key-value pairings associated with the data file, derived from the filename",
                        "type": "array",
                        "properties": {
                            "study": {
                                "name": "Study",
                                "description": "Label designating a given study",
                                "type": "string"
                            },
                            "site": {
                                "name": "Site",
                                "description": "Label designating the site where the data was collected",
                                "type": "string"
                            },
                            "subject": {
                                "name": "Subject",
                                "description": "Label designating the subject corresponding to the data in the file",
                                "type": "string"
                            },
                            "session": {
                                "name": "Session",
                                "description": "Label designating a given session of the study",
                                "type": "string"
                            },
                            "task": {
                                "name": "Task",
                                "description": "Label designating the type of task in which the data was collected",
                                "type": "string"
                            },
                            "condition": {
                                "name": "Condition",
                                "description": "Label designating the condition under which the data was collected",
                                "type": "string"
                            },
                            "trial": {
                                "name": "Trial",
                                "description": "Label designating the trial associated with the data",
                                "type": "string"
                            },
                            "stimulus": {
                                "name": "Stimulus",
                                "description": "Label designating the stimulus item associated with the data",
                                "type": "string"
                            },
                            "description": {
                                "name": "Description",
                                "description": "Label describing the data file in question",
                                "type": "string"
                            }
                        }
                    }
                }
            }
        }
    },
    "objects": {
        "common_principles": {
            "dataset": {
                "name": "Dataset",
                "display_name": "Dataset",
                "description": "A set of behavioral data acquired for the purpose of a particular study or set of studies.\n"
            },
            "extension": {
                "name": "File extension",
                "display_name": "File extension",
                "description": "A portion of the file name after the left-most period (`.`) preceded by any other alphanumeric.\nFor example, `.gitignore` does not have a file extension,\nbut the file extension of 'study-1_data.csv' is '.csv'.\nNote that the left-most period is included in the file extension.\n"
            },
            "keywords": {
                "name": "Keywords",
                "display_name": "Keywords",
                "description": "A set of identifying key-value duples associated with a given data file.\nKeys are limited to a vocabulary of:\n  - study\n  - site\n  - subject\n  - session\n  - task\n  - condition\n  - trial\n  - stimulus\n  - description\n"
            },
            "raw_data": {
                "name": "Raw data",
                "display_name": "Raw data",
                "description": "A central principle for Psych-DS is that the earliest form of the data you have access to should always be saved, \nshould never be modified, and should be kept separate from any additional versions created. This data could take any form,\nsuch as physical paper and pencil surveys, digital resources such as videos, etc. At a minimum, it is assumed that a psych-DS\ncompliant dataset will contain this original data under the /data directory.\n"
            },
            "primary_data": {
                "name": "Primary data",
                "display_name": "Primary data",
                "description": "Primary data is considered the first digitized form of the raw data. Sometimes, the primary data and the raw data are the same,\nin the case, for instance, of tabular online survey responses. If the raw data exists in a physical format, then some digitized \nversion must be included in the dataset.\n"
            },
            "columns": {
                "name": "Columns",
                "display_name": "Columns",
                "description": "In general, Psych-DS has minimal restraints and conventions regarding column names. \nWe RECOMMEND that you use the controlled keywords defined elsewhere in the standard plus \"_id\"\nas column names if referring to the relevant information in a dataset. (That is, if you record trials\nwith the scope of a given datafile, we RECOMMEND that the name of the column identifying the trial\nbe \"trial_id\"). This information can be redundantly stored (i.e., a file named \"study-MyExp_trial-1_data.csv\"\ncan also have a column \"trial_id\" which has rows with the value \"1\").\n\nIn many cases, some combination of columns will uniquely identify every row in the dataset (for instance,\neach participant might have several rows, but there might be exactly one row for every combination of \nparticupant, condition, and trial.) The column or set of columns provides a unique key for every record/row in\nyour dataset. We RECOMMEND that you include a description of which columns create a unique key for your dataset\nin the README for your project.\n\nIf you have a column that uniquely identifies each single row of a dataset explicitly it SHOULD be named\n\"row_id\". A column named \"row_id\" MUST contain unique values in every row.\n"
            },
            "inheritance": {
                "name": "Inheritance",
                "display_name": "Inheritance",
                "description": "In addition to the mandatory \"dataset_description.json\" file at the root of the dataset,\nPsych-DS allows for the inclusion of additional metadata files, whose fields apply to \nspecific subsets of the data. There are two types of inherited metadata:\n\n1. Sidecar files, which contain metadata that pertains to one specific datafile. These sidecars\nmust have the exact same name as their corresponding datafile, with the \".json\" extension instead \nof the \".csv\" extension. Sidecars must occupy the same directory as their datafile.\n2. Directory metadata, which always takes the form \"file_metadata.json\". The metadata contained in\nsuch files apply to all datafiles within its directory and all subdirectories thereof.\n\nMetadata key/value pairs found in higher-level JSON files are inherited by all lower levels unless they are explicitly \noverridden by a file at the lower level.\n\nFor example, suppose we have the following project structure:\n\ndata/\n  file_metadata.json\n  subject-1/\n    file_metadata.json\n    subject-1_condition-A_data.csv\n    subject-1_condition-B_data.json\n    subject-1_condition-B_data.csv\n  subject-2/\n    subject-2_condition-A_data.json\n    subject-2_condition-A_data.csv\n    subject-2_condition-B_data.csv\n\nThere are 4 datafiles within the data/ hierarchy; let's consider which metadata files apply to each one, and in what order \nthe metadata files should be processed/inherited:\n - data/subject-1/subject-1_condition-A_data.csv: There is no JSON sidecar for this file. \n   However, there is a file_metadata.json file in the same directory as the data file, \n   as well as in one above it. The consolidated metadata object would start with the \n   contents of the higher-level file (data/file_metadata.json), and then update it with \n   the contents of the lower-level file (data/subject-1/file_metadata.json).\n - data/subject-1/subject-1_condition-B_data.csv: The same process unfolds as for the previous \n   file; however, the consolidated object is now further updated with the contents of the target \n   data file\u2019s JSON sidecar (i.e., subject-1_condition-B_data.json).\n - data/subject-2/subject-2_condition-A_data.csv: The contents of data/file_metadata.json \n   are read, and then updated with the contents of data/subject-2/subject-2_condition-A_data.json.\n - data/subject-2/subject-2_condition-B_data.csv: There is only a single applicable metadata \n   file (data/file_metadata.json), from which all metadata is read.\n\nNote that any inherited key/value pair from a metadata file replaces the value for the key wholesale,\nand there is no merging processed involved. For instance, if the root metadata file contains a \"variableMeasured\"\nproperty with 10 elements, and a lower level metadata file contains a \"variableMeasured\" property with\n5 elements, the resulting inherited object will only contain the 5 \"variableMeasured\" elements\nfrom the inherited metadata. The lists are not combined in any way, but replaced."
            }
        },
        "metadata": {
            "name": {
                "name": "name",
                "display_name": "Name",
                "description": "Name of the dataset.\n",
                "type": "string"
            },
            "schemaVersion": {
                "name": "schemaVersion",
                "display_name": "Schema Version",
                "description": "The version of the data specification that this dataset conforms to.\n",
                "type": "string"
            },
            "description": {
                "name": "description",
                "display_name": "Description",
                "description": "Detailed description of the dataset.\n",
                "type": "string"
            },
            "variableMeasured": {
                "name": "variableMeasured",
                "display_name": "Variable Measured",
                "description": "List of the column names that appear in the data files.\n",
                "type": "array"
            },
            "author": {
                "name": "author",
                "display_name": "Author",
                "description": "List of individuals who contributed to the creation/curation of the dataset.\n",
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "citation": {
                "name": "citation",
                "display_name": "Citation",
                "description": "Citation data for referencing the dataset, or URL/path for structured citation file.\n",
                "type": "string"
            },
            "license": {
                "name": "license",
                "display_name": "Kucebse",
                "description": "Author-assigned 'license' for data/material use. While this can be a string of text, \na URL pointing to a specific license file (online or in the project directory) is preferred.\n",
                "type": "string"
            },
            "funder": {
                "name": "funder",
                "display_name": "Funder",
                "description": "List of sources of funding (grant numbers).\n",
                "type": "string"
            },
            "url": {
                "name": "url",
                "display_name": "URL",
                "description": "Canonical source for the dataset.\n",
                "type": "string"
            },
            "identifier": {
                "name": "identifier",
                "display_name": "Identifier",
                "description": "Identifier that uniquely distinguishes the dataset.\n",
                "type": "string"
            },
            "usageInfo": {
                "name": "usageInfo",
                "display_name": "Privacy Policy",
                "description": "A string to indicate whether any of the values in the dataset are desired to be shareable.\nThis does not guarantee that the dataset HAS been shared or HAS been de identified,.\n",
                "type": "string"
            },
            "keywords": {
                "name": "keywords",
                "display_name": "Keywords",
                "description": "Keywords with which to tag the dataset for reference.\n",
                "type": "array"
            }
        },
        "extensions": {
            "json": {
                "value": ".json",
                "display_name": "JavaScript Object Notation",
                "description": "A JSON file.\n\nTop-level and collated metadata files are all stored in the JSON format in psych-DS.\n"
            },
            "csv": {
                "value": ".csv",
                "display_name": "Comma-Separated Values",
                "description": "A CSV file with a header row of column names spanning all filled columns. In Psych-DS,\nCSV files have the following rules related to their formatting:\n- Each CSV file MUST start with a header line listing the names of all columns. Names MUST be separated with commas.\n- String values containing commas MUST be escaped using double quotes\n- UTF-8 encoding MUST be used\n- using . rather than , for decimals is RECOMMENDED"
            }
        },
        "files": {
            "CHANGES": {
                "display_name": "Changelog",
                "file_type": "regular",
                "description": "Version history of the dataset \\(describing changes, updates and corrections\\) MAY be provided in the form of a 'CHANGES' text file. \\(.txt or .md\\)."
            },
            "README": {
                "display_name": "README",
                "file_type": "regular",
                "description": "Human-readable file describing the project and dataset in detail. This is an OPTIONAL file, and only one README file should appear in dataset."
            },
            "dataset_description": {
                "display_name": "Dataset Description",
                "file_type": "regular",
                "description": "The metadata file 'dataset_description.json' is a JSON file describing the dataset."
            },
            "Datafile": {
                "display_name": "CSV Datafile",
                "file_type": "regular",
                "description": "A CSV file under the /data directory in which the official psych-DS compliant data from the dataset is stored. Datafiles must follow Psych-DS file naming conventions, which includes the use of keyword formatting, the '_data' suffix, and the '.csv' extension. An example of a valid datafile might be 'study-123_site-lab4_data.csv'. In the future, more official suffices and extensions may be made available. A controlled list of official keywords is provided, but the use of unofficial keywords is permitted, so long as they are clearly defined and used consistently within a research community."
            },
            "data": {
                "display_name": "Data",
                "file_type": "directory",
                "description": "The directory in which to store all datafiles from the dataset."
            },
            "primary_data": {
                "display_name": "Primary data",
                "file_type": "directory",
                "description": "A subfolder holding the primary data, which may be either Psych-DS compliant CSV or some other file type"
            },
            "analysis": {
                "display_name": "Analysis",
                "file_type": "directory",
                "description": "A directory to store code or other tools used to analyze the data/ files in order to describe and interpret the dataset. Any intermediate data files created during analysis SHOULD be output to a new file in data/ \\(i.e. primary_data/ files SHOULD NOT be modified.\\)"
            },
            "results": {
                "display_name": "Results",
                "file_type": "directory",
                "description": "A directory in which to store any results generated using the data in /data."
            },
            "materials": {
                "display_name": "Materials",
                "file_type": "directory",
                "description": "A directory in which to store any materials used to conduct the study."
            },
            "documentation": {
                "display_name": "Documentation",
                "file_type": "directory",
                "description": "A directory in which to store any project-related documentation that is used for conducting the study \\(e.g. consent forms\\)"
            },
            "products": {
                "display_name": "Products",
                "file_type": "directory",
                "description": "A directory in which to store any Any relevant products resulting from the project \\(e.g., publications, posters, software descriptions, presentations, etc.\\)"
            },
            "DirectoryMetadata": {
                "display_name": "Directory Metadata",
                "file_type": "regular",
                "description": "A json file in which to store metadata that applies to all datafiles within the containing directory or within any nested subdirectories. Fields from the file replace the values of the global dataset_description object."
            },
            "SidecarMetadata": {
                "display_name": "Sidecar Metadata",
                "file_type": "regular",
                "description": "A json file in which to store metadata that applies to a specific datafile within the containing directory. Fields from the file replace the values of the global dataset_description object, and overwrite any fields shared with the directory metadata."
            },
            "CompiledMetadata": {
                "display_name": "Compiled Metadata",
                "file_type": "composite",
                "description": "The metadata object that results from the combination of global metadata and directory- and file-level metadata files according to the rules of inheritance."
            }
        }
    },
    "rules": {
        "files": {
            "tabular_data": {
                "data": {
                    "Datafile": {
                        "requires": "data",
                        "suffix": "data",
                        "extensions": [
                            ".csv"
                        ],
                        "baseDir": "data",
                        "arbitraryNesting": true,
                        "columnsMatchMetadata": true,
                        "usesKeywords": true,
                        "nonCanonicalKeywordsAllowed": true,
                        "fileRegex": "([a-z]+-[a-zA-Z0-9]+)(_[a-z]+-[a-zA-Z0-9]+)*_data\\.csv",
                        "code": "MISSING_DATAFILE",
                        "level": "error",
                        "reason": "It is required to include at least one valid csv datafile under the data subdirectory "
                    }
                }
            },
            "common": {
                "core": {
                    "dataset_description": {
                        "level": "error",
                        "baseDir": "/",
                        "stem": "dataset_description",
                        "arbitraryNesting": false,
                        "extensions": [
                            ".json"
                        ],
                        "code": "MISSING_DATASET_DESCRIPTION",
                        "reason": "It is required to include a 'dataset_description.json' in the base directory"
                    },
                    "README": {
                        "level": "warning",
                        "baseDir": "/",
                        "stem": "README",
                        "arbitraryNesting": false,
                        "extensions": [
                            ".md",
                            ".txt"
                        ],
                        "code": "MISSING_README_DOC",
                        "reason": "It is recommended to include a 'README.md' or 'README.txt' file in the base directory"
                    },
                    "CHANGES": {
                        "level": "ignore",
                        "baseDir": "/",
                        "stem": "CHANGES",
                        "arbitraryNesting": false,
                        "extensions": [
                            ".md",
                            ".txt"
                        ],
                        "code": "MISSING_CHANGES_DOC",
                        "reason": "It is recommended to include a 'CHANGES.md' or 'CHANGES.txt' file in the base directory"
                    },
                    "data": {
                        "level": "error",
                        "path": "/data",
                        "directory": true,
                        "requires": "dataset_description",
                        "code": "MISSING_DATA_DIRECTORY",
                        "reason": "It is required to include a subdirectory named 'data' in the base directory"
                    },
                    "analysis": {
                        "level": "ignore",
                        "path": "/analysis",
                        "directory": true,
                        "code": "MISSING_ANALYSIS_DIRECTORY",
                        "reason": "It is recommended to include subdirectory named 'analysis' in the base directory"
                    },
                    "results": {
                        "level": "ignore",
                        "path": "/results",
                        "directory": true,
                        "code": "MISSING_RESULTS_DIRECTORY",
                        "reason": "It is recommended to include subdirectory named 'results' in the base directory"
                    },
                    "materials": {
                        "level": "ignore",
                        "path": "/materials",
                        "directory": true,
                        "code": "MISSING_MATERIALS_DIRECTORY",
                        "reason": "It is recommended to include subdirectory named 'materials' in the base directory"
                    },
                    "documentation": {
                        "level": "ignore",
                        "path": "/documentation",
                        "directory": true,
                        "code": "MISSING_DOCUMENTATION_DIRECTORY",
                        "reason": "It is recommended to include subdirectory named 'documentation' in the base directory"
                    }
                }
            },
            "metadata": {
                "DirectoryMetadata": {
                    "stem": "file_metadata",
                    "extensions": [
                        ".json"
                    ],
                    "baseDir": "data",
                    "arbitraryNesting": true,
                    "level": "warning",
                    "code": "MISSING_DIRECTORY_METADATA",
                    "reason": "It is optional to include a json metadata file within a data subdirectory that \napplies to all files within the current directory and its subdirectories\n"
                },
                "SidecarMetadata": {
                    "baseDir": "data",
                    "arbitraryNesting": true,
                    "suffix": "data",
                    "level": "warning",
                    "extensions": [
                        ".json"
                    ],
                    "code": "MISSING_SIDECAR_METADATA",
                    "reason": "It is optional to include a json metadata file within a data subdirectory\nthat applies to a specific csv datafile within the current directory"
                }
            }
        },
        "errors": {
            "JsonInvalid": {
                "code": "JSON_INVALID",
                "reason": "Not a valid JSON file.\n",
                "level": "error",
                "selectors": [
                    "extension == \".json\""
                ],
                "requires": []
            },
            "FileRead": {
                "code": "FILE_READ",
                "reason": "We were unable to read this file.\nMake sure it contains data (file size > 0 kB) and is not corrupted,\nincorrectly named, or incorrectly symlinked.\n",
                "level": "error",
                "requires": []
            },
            "EmptyFile": {
                "code": "EMPTY_FILE",
                "level": "error",
                "reason": "empty files not allowed.",
                "requires": []
            },
            "InvalidJsonEncoding": {
                "code": "INVALID_JSON_ENCODING",
                "reason": "JSON files must be valid utf-8.\n",
                "level": "error",
                "selectors": [
                    "extension == \".json\""
                ],
                "requires": [
                    "rules.files.common.core.dataset_description"
                ]
            },
            "JsonKeyRequired": {
                "code": "JSON_KEY_REQUIRED",
                "level": "error",
                "reason": "The metadata object is missing a key listed as required.",
                "requires": [
                    "rules.files.common.core.dataset_description",
                    "rules.files.tabular_data.data.Datafile"
                ]
            },
            "JsonKeyRecommended": {
                "code": "JSON_KEY_RECOMMENDED",
                "level": "warning,",
                "reason": "The metadata object is missing a key listed as recommended.",
                "requires": [
                    "rules.files.common.core.dataset_description",
                    "rules.files.tabular_data.data.Datafile"
                ]
            },
            "CsvColumnMissing": {
                "code": "CSV_COLUMN_MISSING",
                "level": "error",
                "reason": "A required column is missing",
                "requires": [
                    "rules.files.common.core.dataset_description",
                    "rules.files.tabular_data.data.Datafile"
                ]
            },
            "NotIncluded": {
                "code": "NOT_INCLUDED",
                "level": "warning",
                "reason": "Files with such naming scheme are not part of psych-DS specification.\nUnder the rules of psych-DS, non-specified files are allowed to be included,\nbut if you would like to avoid receiving this warning moving forward, you can include\nin your \".psychdsignore\" file\n",
                "requires": []
            },
            "MissingRequiredElement": {
                "code": "MISSING_REQUIRED_ELEMENT",
                "level": "error",
                "reason": "Your dataset is missing an element that is required under the psych-DS specification.",
                "requires": []
            },
            "NoHeader": {
                "code": "NO_HEADER",
                "level": "error",
                "reason": "CSV data files must contain a valid header with at least one column.",
                "requires": [
                    "rules.files.tabular_data.data.Datafile"
                ]
            },
            "HeaderRowMismatch": {
                "code": "HEADER_ROW_MISMATCH",
                "level": "error",
                "reason": "The header and all rows for CSV data files must contain the same number of columns.",
                "requires": [
                    "rules.files.tabular_data.data.Datafile"
                ]
            },
            "RowidValuesNotUnique": {
                "code": "ROWID_VALUES_NOT_UNIQUE",
                "level": "error",
                "reason": "Columns within CSV data files with the header \"row_id\" must contain unique values in every row.",
                "requires": [
                    "rules.files.tabular_data.data.Datafile"
                ]
            },
            "WrongMetadataLocation": {
                "code": "WRONG_METADATA_LOCATION",
                "level": "warning",
                "reason": "The main metadata file must be located within the root directory",
                "requires": []
            },
            "KeywordFormattingError": {
                "code": "KEYWORD_FORMATTING_ERROR",
                "level": "error",
                "reason": "All datafiles must use psych-DS keyword formatting. That is, datafile names must consist of\na series of keyword-value pairs, separated by underscores, with keywords using only lowercase\nalphabetic characters and values using any alphanumeric characters of either case. The file must\nend with '_data.csv'. In other words, files must follow this regex: \n/([a-z]+-[a-zA-Z0-9]+)(_[a-z]+-[a-zA-Z0-9]+)*_data\\.csv/\n",
                "requires": []
            },
            "UnofficialKeywordWarning": {
                "code": "UNOFFICIAL_KEYWORD_WARNING",
                "level": "warning",
                "reason": "Although it is not recommended, datafiles are permitted to use keywords other than those provided\nin the official psych-DS specification. If you do choose to use unofficial keywords, please ensure\nthat they are clearly defined within your research community and used consistently across relevant datasets.\n",
                "requires": []
            },
            "UnofficialKeywordError": {
                "code": "UNOFFICIAL_KEYWORD_ERROR",
                "level": "error",
                "reason": "Names for data files must not include keywords other than those listed in the psych-DS schema.",
                "requires": []
            },
            "InvalidJsonFormatting": {
                "code": "INVALID_JSON_FORMATTING",
                "level": "error",
                "reason": "One of your metadata files in not in valid JSON format.",
                "requires": [
                    "rules.files.common.core.dataset_description"
                ]
            },
            "IncorrectDatasetType": {
                "code": "INCORRECT_DATASET_TYPE",
                "level": "error",
                "reason": "Your metadata is missing the required schema.org \"Dataset\" type",
                "requires": [
                    "rules.files.common.core.dataset_description",
                    "rules.files.tabular_data.data.Datafile"
                ]
            },
            "MissingDatasetType": {
                "code": "MISSING_DATASET_TYPE",
                "level": "error",
                "reason": "Your metadata is missing the \"@type/type\" property, which is required.",
                "requires": [
                    "rules.files.common.core.dataset_description",
                    "rules.files.tabular_data.data.Datafile"
                ]
            },
            "UnknownNamespace": {
                "code": "UNKNOWN_NAMESPACE",
                "level": "warning",
                "reason": "The psych-DS validator only has access to one external vocabulary, \"http://schema.org\";\nany other reference to an external schema is permitted, but the validity of the terms used\ncannot be confirmed.\n",
                "requires": [
                    "rules.files.common.core.dataset_description",
                    "rules.files.tabular_data.data.Datafile"
                ]
            },
            "ObjectTypeMissing": {
                "code": "OBJECT_TYPE_MISSING",
                "level": "warning",
                "reason": "For compliance with the schema.org ontology, all objects within the metadata (with a few exceptions)\nthat appear as the value of a schema.org key/property must contain a \"@type\" key with a valid schema.org type \nas its value.\n",
                "requires": [
                    "rules.files.common.core.dataset_description",
                    "rules.files.tabular_data.data.Datafile"
                ]
            },
            "InvalidSchemaorgProperty": {
                "code": "INVALID_SCHEMAORG_PROPERTY",
                "level": "warning",
                "reason": "The schema.org ontology contains a fixed set of legal properties which can be applied to objects within the metadata.\n If schema.org is used as the only @context within your metadata, then all properties will be interpreted as schema.org properties.\n Using an invalid schema.org property is not considered an error in the psych-DS specification, but it should be understood\n that such usages result in the property in question not being interpretable by machines.\n",
                "requires": [
                    "rules.files.common.core.dataset_description",
                    "rules.files.tabular_data.data.Datafile"
                ]
            },
            "InvalidObjectType": {
                "code": "INVALID_OBJECT_TYPE",
                "level": "warning",
                "reason": "Properties in the schema.org ontology have selective restrictions on which types of objects can be used for their values.\nincluding an object with a @type that does not match the selective restrictions of its property is not an error in psych-DS,\nbut it will result in the object in question not being interpretable by machines.\n",
                "requires": [
                    "rules.files.common.core.dataset_description",
                    "rules.files.tabular_data.data.Datafile"
                ]
            },
            "ExtensionMismatch": {
                "code": "EXTENSION_MISMATCH",
                "level": "error",
                "reason": "Extension used by file does not match allowed extensions for its suffix.\n",
                "requires": []
            }
        },
        "common_principles": [
            "dataset",
            "extension",
            "keywords"
        ],
        "csv_data": {
            "Datafile": {
                "selectors": [
                    "extension == \".csv\"",
                    "suffix == \"data\"",
                    "baseDir == \"data\""
                ],
                "columnsMatchMetadata": true
            }
        },
        "compiled_metadata": {
            "CompiledMetadata": {
                "selectors": [
                    "suffix == \"data\"",
                    "extension == \".csv\"",
                    "baseDir == \"data\""
                ],
                "fields": {
                    "name": "required",
                    "description": "required",
                    "variableMeasured": "required",
                    "author": "recommended",
                    "citation": "recommended",
                    "license": "recommended",
                    "funder": "recommended",
                    "url": "recommended",
                    "identifier": "recommended",
                    "privacyPolicy": "recommended",
                    "keywords": "recommended"
                },
                "namespace": "http://schema.org/",
                "jsonld": true,
                "containsAllColumns": true
            }
        }
    }
};