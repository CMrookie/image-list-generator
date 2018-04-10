const fs = require('fs'),
    path = require('path'),
    argv = require('yargs').argv;

function getImgList(imgFolder, listPath){
    let reg = /^[^\.]/,
        list = [],
        rootDirectory = '';

    if (__dirname.indexOf('node_modules') !== -1){
        rootDirectory = __dirname.split('node_modules')[0];
    }
    else{
        rootDirectory = __dirname;
    }

    function pushInList(item){
        let imgPath = '';

        if (item.indexOf('dist') !== -1){
            imgPath = item.split('dist')[1];
        }
        else{
            imgPath = item.split('src')[1];
        }

        list.push(`'.${imgPath}'`)
    }

    function getImgLoop(imgFolder){
        // console.log('rootDirectory: ',imgFolder)
        let fileList = fs.readdirSync(path.resolve(rootDirectory, imgFolder));
        fileList.forEach(((val, i, arr) => {
            if (reg.test(val)){
                if (fs.statSync(path.resolve(rootDirectory, imgFolder, val)).isDirectory()){
                    getImgLoop(path.resolve(rootDirectory, imgFolder, val))
                }
                else{
                    console.log('rootDirectory: ',rootDirectory, imgFolder, val)
                    pushInList(path.resolve(rootDirectory, imgFolder, val))
                }
            }
        }))
    }

    getImgLoop(imgFolder, listPath)

    fs.writeFile(path.resolve(rootDirectory, listPath, 'imagesList.js'), `module.exports = [${list}]`, (err) => {
        if(err){console.log(err)}
        console.log('create file imagesList in: ', path.resolve(rootDirectory, listPath));
    })
}

getImgList(argv.folder, argv.path)