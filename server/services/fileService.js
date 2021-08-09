const fs = require('fs')
const config = require('config')

class FileService {

    createDir(file) {

        const filePath = `${config.get('filePath')}\\${file.user}\\${file.path}`
        return new Promise(((resolve, reject) => {
            try{
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath)
                    return resolve({message: 'File has been created!'})
                } else {
                    return reject({message: "File is already existed"})
                }
            }catch (e) {
                return reject({message: 'File error'})
            }
        }))
    }

    deleteFile(file) {
        try{
            const path = this.getPath(file)
            if (file.type === 'dir') {
                fs.rmdirSync(path)
            } else {
                fs.unlinkSync(path)
            }
        }catch (e) {
            console.log(e)
            throw new Error
        }
    }

    getPath(file) {

        const path = `${config.get('filePath')}\\${file.user}\\${file.path}`
        return path
    }
}

module.exports = new FileService()