import {initializeBlock, useBase, useRecords, useViewMetadata} from '@airtable/blocks/ui';
import React from 'react';

import Table from '@airtable/blocks/dist/types/src/models/table';

function getTablesAsHTML() {
    const base = useBase();
    const tables = base.tables;
    const tableInfos = []
    for (const table of tables) {
        tableInfos.push(<li>{table.id}, {table.name} {getViewsAsHTML(table)}</li>);
    }
    return <ul>{tableInfos}</ul>
}

function getTableNames() {
    const base = useBase();
    const tables = base.tables;
    const tableNames = []
    for (const table of tables) {
        tableNames.push(table.name);
    }
    return tableNames
}

function getViewsAsHTML(table: Table) {
    const views = table.views;
    const viewInfos = []
    for (const view of views) {
        viewInfos.push(<li>{view.id}, {view.name} {getFieldsAsHTML(view)}</li>)
    }
    return <ul>{viewInfos}</ul>
}

function getViewNames(table: Table) {
    const views = table.views;
    const viewNames = []
    for (const view of views) {
        viewNames.push(view.name)
    }
    return viewNames
}

function getFieldsAsHTML(view) {
    const viewMetadata = useViewMetadata(view);

    return (
        <ul>
            {viewMetadata.visibleFields.map(field => (
                <li key={field.id}>{field.name}</li>
            ))}
        </ul>
    );
}

function getFieldNames(view) {
    const viewMetadata = useViewMetadata(view);

    return (
        Array.from(viewMetadata.visibleFields.map(field => (
            field.name
        )))
    );
}

const templateStructure = {
    label: null,
    title: null,
    start: null,
    end: null,
    image_m: null,
    image_sq: null,
    url: null,
    movies: null,
    month_id: null,
    categories: null
}

const templateCategory = {
    id: null,
    slug: null,
    name_ja: null,
    name_en: null
}

function outputRecords() {
    const base = useBase();
    const tables = base.tables;
    const rows = []
    for (const table of tables) {
        for (const view of table.views) {
            if(view.name == '出力用') {
                const fields = useViewMetadata(view).visibleFields
                const queryResult = view.selectRecords();
                const records = useRecords(queryResult);

                rows.push(Array.from(records.map(row => {
                    const cols = structuredClone(templateStructure);
                    cols["categories"] = [];
                    cols["label"] = table.name;
                    for (const field of fields) {
                        // Process to arrange of ICC categories
                        if (field.name.includes("from Categories")) {
                            let values = row.getCellValueAsString(field).split(", ");
                            for (let i=0; i<values.length; i++) {
                                const key = field.name.replace(" (from Categories)", "");
                                if (cols["categories"].length == 0) {
                                    for (let i = 0; i < values.length; i++) {
                                        cols["categories"].push(structuredClone(templateCategory));
                                      }
                                }
                                cols["categories"][i][key] =  values[i];
                            }
                        }
                        // Process to arrange of values
                        else {
                            if (field.name == "occurrence") {
                                cols["title"] = row.getCellValue(field)
                                continue
                            }
                            if (field.name == "evala_category") {
                                cols["label"] = `evala/${row.getCellValue(field).name}`
                                continue
                            }
                            if (field.name == "nullDate") {
                                cols["nullDate"] = row.getCellValue(field).toLowerCase() === "true";
                                continue
                            }
                            cols[field.name] = row.getCellValue(field)
                        }
                    }

                    if (cols["categories"].length == 0) cols["categories"] = null
                    if (cols["movies"] !== null && !cols["movies"].includes("https://")) {
                        cols["movies"] = null;
                    } else {
                        cols["movies"] = JSON.parse(cols["movies"]);
                    }
                    return cols
                })))
            }
        }
        
    }
    return (
        JSON.stringify(rows)
    );
}


function HelloWorldTypescriptApp() {
    // YOUR CODE GOES HERE
    return (
        <div>
            {/* Hello world 🚀<br /> */}
            {/* {getTablesAsHTML()} */}
            {outputRecords()}
        </div>
    )
}

initializeBlock(() => <HelloWorldTypescriptApp />);
