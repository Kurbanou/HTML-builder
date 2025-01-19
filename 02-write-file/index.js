const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const writableStream = fs.createWriteStream(filePath, {flags: 'a'});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Привет! Введите текст для записи в файл. Для выхода нажмите Ctrl+C или введите "exit".');

rl.on('line', (input) => {
    if (input.trim().toLowerCase() === 'exit') {
        exitProgram();
    } else {
        writableStream.write(input + '\n', (err) => {
            if (err) {
                console.error('Ошибка при записи в файл:', err.message)
            }
        });
    }
})

rl.on('SIGINT', exitProgram);


function exitProgram() {
    console.log('До свидания! Программа завершена.');
    writableStream.end();
    rl.close();
}