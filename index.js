const testFolder = './files/';
const fs = require('fs');
const readline = require('readline-sync');
const iconv = require('iconv-lite');

function main() {
    console.log("1. Отобрать файлы")
    console.log("2. Обновить файлы")
    const answer = readline.question("1, 2?\n")
    switch (answer) {
        case '1':
            getFiles()
            break
        case '2':
            updateCsv()
            break
        default:
            break
    }

}

main()

function getFiles() {
    const listValues = fs.readFileSync('./input/index.txt', 'utf8');
    const listIndexes = generateList(listValues)
    const files = fs.readdirSync('./input/csv/')
    files.forEach(file => {
        listIndexes.forEach(index => {
            if (file.includes(index)) {
                fs.copyFile('./input/csv/' + file, './files/' + file, (err) => {
                    if (err) throw err;
                    console.log(file + ' was copied to files');
                });
            } else {
                console.log(file + ' wasnt copied to files');

            }
        })
    })
}

function updateCsv() {
    const files = fs.readdirSync('./files/')
    if (files.length < 1) return
    files.forEach(file => {
        fs.readFile('./files/' + file, null, function (err, data) {
            if (err) throw err;
            console.log('Name: ' + file);
            const decodedData = iconv.decode(data, 'win1251')
            const updated = changeNumber(decodedData.toString())
            const headerData = getHeader(updated)
            console.log(updated)
            const body = removelines(updated)
            saveFile(headerData + body, numberTicket(headerData))
            console.log(headerData + body)

        });
    });
}



function changeNumber(text) {
    const result = text.substr(0, 24) + '_1' + text.substr(24);
    return result
}

function getHeader(text) {
    const result = text.split('\n')[0] + '\n'
    return result
}

function removelines(text) {
    let length = Number(readline.question("Сколько строк удалить?"));
    const lines = text.split('\n')
    lines.splice(0, length + 1);
    return lines.join('\n');
}

function saveFile(data, filename) {
    const encodedData = iconv.encode(data, 'win1251')
    fs.writeFileSync('./output/' + filename + ".csv", encodedData)
}

function numberTicket(header) {
    return header.substr(18, 6);
}

function generateList(data) {
    const listValues = data.split('\n')
    const listIndexes = []
    listValues.forEach((value) => {
        if (!listIndexes.includes(value)) {
            listIndexes.push(value)
        }
    })
    return listIndexes
}