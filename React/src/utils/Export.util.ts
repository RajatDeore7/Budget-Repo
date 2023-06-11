const printJS: any = (window as any).printJS ?? {};

const print = (elementId: string) => {
    const includes = ['/css/app.css', '/css/bootstrap.min.css', '/css/printjs.css'];
    printJS({
        printable: elementId,
        type: 'html',
        css: includes,
        maxWidth: '1024px',
        targetStyles: ["*"]
    });
}

const initCsvDownload = (buttonId: string, tableContainerId: string, filename: string) => {
    const textProcess = (node: any) => {
        if(node.hasAttribute('no-export')) return ''
        return node.innerText.replace(/\$/g,'').replace(/,/g,'');
    }
    const button: any = window.document.getElementById(buttonId);
    if (button) {
        button.addEventListener('click', () => {
            const tables: any = document.querySelectorAll(`#${tableContainerId} table`);
            let csvString = '';
            for(const table of tables) {
                for(let i= 0; i < table.rows.length;i++){
                    const rowData = table.rows[i].cells;
                    for(let j=0; j<rowData.length;j++){
                        csvString = csvString + textProcess(rowData[j]) + ",";
                    }
                    csvString = csvString.substring(0,csvString.length - 1);
                    csvString = csvString + "\n";
                }
                csvString = csvString + "\n\n";
            }
            csvString = csvString.substring(0, csvString.length - 1);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = 'data:application/octet-stream;base64,' + btoa(csvString);
            a.download = filename;
            document.getElementsByTagName('body')[0].appendChild(a);
            a.click();
            a.remove();
        });
    }
}

export const ExportUtil = {
    print,
    initCsvDownload,
}
