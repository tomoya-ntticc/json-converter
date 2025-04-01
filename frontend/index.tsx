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

function getViewsAsHTML(table: Table) {
    const views = table.views;
    const viewInfos = []
    for (const view of views) {
        viewInfos.push(<li>{view.id}, {view.name} {getFieldsAsHTML(view)}</li>)
    }
    return <ul>{viewInfos}</ul>
}

function getFieldsAsHTML(view) {
    const viewMetadata = useViewMetadata(view);

    return (
        <ul>
            {viewMetadata.visibleFields.map(field => (
                <li>{field.id}, {field.name}</li>
            ))}
        </ul>
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
                            let values = row.getCellValueAsString(field) != "" ? row.getCellValueAsString(field).split(", ") : [];
                            for (let i=0; i<values.length; i++) {
                                const key = field.name.replace(" (from Categories)", "");
                                if (cols["categories"].length == 0) {
                                    for (let i = 0; i < values.length; i++) {
                                        cols["categories"].push(structuredClone(templateCategory));
                                      }
                                }
                                cols["categories"][i][key] = key == "id" ?  parseInt(values[i]) : values[i];
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
                                if (table.name == 'evala_at_ICC') {
                                    cols["label"] = `${cols["label"]}＠ICC`
                                }
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
                        try {
                            cols["movies"] = JSON.parse(cols["movies"]);
                        } catch {
                            cols["movies"] = cols["movies"].split(",").map((url) => url.trim());
                        }
                    }

                    if (cols["url"] == "null") cols["url"] = null
                    if (cols["image_m"] == "null") cols["image_m"] = null;
                    if (cols["image_sq"] == "null") cols["image_sq"] = null

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
            {/* {getTablesAsHTML()} */}
            {outputRecords()}
        </div>
    )
}

initializeBlock(() => <HelloWorldTypescriptApp />);
