const path = require('path')
const fs = require('fs')

const args = process.argv.splice(2)
if (args.length == 0) {
    console.log('\x1B[36m%s\x1B[0m','请输入文件夹名字')
    return
}
const page = '../../../src/page'
const name = args[0]
const ignore = ['image','font','page']
for(let v of ignore){
   if (v == name) {
    console.log('\x1B[36m%s\x1B[0m','目录名称不能是'+name)
    return
   }
}
const absPath = path.resolve(__dirname, page + '/' + name)

fs.exists(absPath, function (exists) {
    if (exists) {
        console.log('\x1B[36m%s\x1B[0m','该目录已存在，请更换名字')
        return
    } else {
        fs.mkdir(absPath, function (err) {
            if (!err) {
                const source = ['1.html','1.scss'];
                const dest = [`${name}.html`,  `${name}.scss`];
                for (let i = 0; i < source.length; i++) {
                    const sourceFile = path.resolve(__dirname, 'template/' + source[i])
                    const destPath = path.resolve(__dirname, page + '/' + name + '/' + dest[i])
                    copy(sourceFile, destPath)                
                }
            } else {
                console.log('\x1B[36m%s\x1B[0m','创建失败，请重试')
                return
            }
        })
    }
})

function copy(sourceFile, destPath) {
    var readStream = fs.createReadStream(sourceFile);
    var writeStream = fs.createWriteStream(destPath);
    readStream.pipe(writeStream);
}