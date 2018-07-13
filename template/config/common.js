const fs = require('fs')
const path  = require('path')
const HTMLWebpackPlugin = require("html-webpack-plugin")

function readDirSync(dirPath,result){
    var pa = fs.readdirSync(dirPath)
	pa.forEach(function(ele){
		var info = fs.statSync(dirPath+"/"+ele)	
		if(info.isDirectory()){
            result[ele] = {}
            readDirSync(dirPath+"/"+ele,result[ele])
		}else{
            const extname=path.extname(ele)
            result[extname] = ele
		}	
    })
    return result
}

function getEntry(dirPath){
    const absPath = path.resolve(__dirname,dirPath)
    const dirObj = readDirSync(absPath,{})
    let entry = {}
    for (let key in dirObj) {
        entry[key] =  path.resolve(absPath,key+'/'+dirObj[key]['.scss'])
    }
    return entry
}

function getHtmlWebpackPlugins(dirPath){
    const absPath = path.resolve(__dirname,dirPath)
    const dirObj = readDirSync(absPath,{})
    let htmlWebpackplugins = []
    for (let key in dirObj) {
       const plugin =  new HTMLWebpackPlugin({
            filename: key+'/'+dirObj[key]['.html'],
            template: path.resolve(absPath, key+'/'+dirObj[key]['.html']),
            chunks:[key], 
            inject: true           
        })
        htmlWebpackplugins.push(plugin)
    }
    return htmlWebpackplugins
}

exports.getEntry = getEntry

exports.getHtmlWebpackPlugins = getHtmlWebpackPlugins