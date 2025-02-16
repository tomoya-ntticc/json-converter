import {initializeBlock, useBase, useRecords, useViewMetadata} from '@airtable/blocks/ui';
import React from 'react';

// import {base} from '@airtable/blocks';
import Table from '@airtable/blocks/dist/types/src/models/table';
import View from '@airtable/blocks/dist/types/src/models/view';

// console.log('The name of your base is', base.name);

function getTables() {
    const base = useBase();
    const tables = base.tables;
    const tableInfos = []
    for (const table of tables) {
        tableInfos.push(<li>{table.id}, {table.name} {getViews(table)}</li>);
    }
    return <ul>{tableInfos}</ul>
}

function getViews(table: Table) {
    const views = table.views;
    const viewInfos = []
    for (const view of views) {
        viewInfos.push(<li>{view.id}, {view.name} {getViewFields(view)}</li>)
    }
    return <ul>{viewInfos}</ul>
}

function getViewFields(view) {
    const viewMetadata = useViewMetadata(view);

    return (
        <ul>
            {viewMetadata.visibleFields.map(field => (
                <li key={field.id}>{field.name}</li>
            ))}
        </ul>
    );
}

function output_records() {
    const base = useBase();
    const table = base.getTableByName('ICC');
    const view = table.getViewByName('出力用');

    const queryResult = view.selectRecords();
    const records = useRecords(queryResult);

    return (
        <ul>
            {records.map(record => (
                <li key={record.id}>
                    {record.name || 'Unnamed record'}
                </li>
            ))}
        </ul>
    );
}


function HelloWorldTypescriptApp() {
    // YOUR CODE GOES HERE
    return (
        <div>
            Hello world 🚀<br />
            {getTables()}
            {/* {output_records()} */}
        </div>
    )
}

initializeBlock(() => <HelloWorldTypescriptApp />);
