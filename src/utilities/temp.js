const fs = require('fs')
const path = require('path')
const readline = require('readline')
const reverseLineReader = require('reverse-line-reader')

const tempPath = process.env.TEMP_PATH || path.join(process.cwd(), 'temp');

const getFilePath = fileName => path.join(tempPath, fileName)

const clearFile = fileName => {
    writeFile(fileName, '')
}

const appendFile = (fileName, data) => {
    const filePath = getFilePath(fileName)
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '')
    }
    fs.appendFileSync(filePath, data)
}

const writeFile = (fileName, data) => {
    const filePath = getFilePath(fileName)
    fs.writeFileSync(filePath, data);
}

const deleteFile = fileName => {
    const filePath = getFilePath(fileName)
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

const readLineByLine = (fileName, cb, delayStep = 0) => {
    return new Promise((resolve, reject) => {
        try {
            const filePath = getFilePath(fileName)
            if (fs.existsSync(filePath)) {
                const rl = readline.createInterface({
                    input: fs.createReadStream(filePath),
                    console: false
                });

                let delay = 0;

                rl.on('line', line => {
                    setTimeout(() => {
                        cb(line)
                        delay += delayStep
                    }, delay * 1000)
                })
                rl.on('close', () => {
                    resolve()
                })
                rl.on('error', err => cb(err))
            }
        } catch (err) {
            reject(err)
        }
    })
}

const reverseLines = fileName => {
    return new Promise((resolve, reject) => {
        try {
            const filePath = getFilePath(fileName)
            const tempPath = getFilePath('temp' + new Date().valueOf())
            if (fs.existsSync(filePath)) {
                fs.writeFileSync(tempPath, '')
                reverseLineReader.eachLine(filePath, (line, last) => {
                    if (!line)
                        return;

                    if (last) {
                        fs.appendFileSync(tempPath, line)
                        fs.unlinkSync(filePath)
                        fs.renameSync(tempPath, filePath)
                        resolve()
                    } else {
                        fs.appendFileSync(tempPath, line + '\n')
                    }
                })
            }
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = Object.create({
    clearFile,
    appendFile,
    writeFile,
    deleteFile,
    readLineByLine,
    reverseLines
})