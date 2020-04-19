const fs = require('fs');
const stream = require('stream');
const {promisify} = require('util');
const {Transform} = require('stream');
const pipeline = promisify(stream.pipeline);
const {program} = require('commander');

function caesarEncode(str, shift, shouldDecode = false) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    return str
        .split('')
        .map(v => {
            const idx = alphabet.indexOf(v.toLowerCase());
            if (idx < 0) return v;
            let newIdx = shouldDecode ? (idx - shift) + 26 : idx + shift;
            newIdx = newIdx % 26;
            return v === v.toUpperCase() ? alphabet[newIdx].toUpperCase() : alphabet[newIdx];
        })
        .join('');
}

function getCaesarStream(shift = 3, shouldDecode = false) {
    return new Transform({
        transform(chunk, encoding, callback) {
            this.push(caesarEncode(chunk.toString(), shift, shouldDecode));
            callback();
        }
    });
}

program
    .option('-s, --shift <number>', 'shift', Number)
    .option('-a, --action <string>', 'action')
    .option('-i, --input <string>', 'input file')
    .option('-o, --output <string>', 'output file')
    .parse(process.argv);

const {shift, action, input, output} = program;
if (!(shift && action && (action === 'encode' || action === 'decode'))) {
    console.error('shift and action params are required');
    process.exit(10);
}

const inputStream = input ? fs.createReadStream(input) : process.stdin;
const outputStream = output ? fs.createWriteStream(output) : process.stdout;
const encodeStream = getCaesarStream(shift, action === 'decode');

pipeline(
    inputStream,
    encodeStream,
    outputStream,
)
    .then(() => {
        console.log('Pipeline succeeded');
    })
    .catch(err => {
        console.error(err.message);
        process.exit(10);
    })
