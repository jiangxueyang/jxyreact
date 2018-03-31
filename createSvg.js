const fs = require('fs');
const path = require('path');
const svgDir = path.resolve(__dirname, './src/assets/icon')

// 读取单个文件
function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(svgDir, filename), 'utf8', function (err, data) {
      let svgXml = data.replace(/(<\?xml.*?\?>|<\!--.*?-->[\n\r]*|<!DOCTYPE.*?>)*([\n\r])*/g, '')
      svgXml = svgXml.replace(/ width="\d{1,3}"/, ' ')
      svgXml = svgXml.replace(/ height="\d{1,3}"/, ' ')
      svgXml = svgXml.replace(/ t="[\d\w]*" /, ' ')
      svgXml = svgXml.replace(/ style="[\d\w]*" /, ' ')
      svgXml = svgXml.replace(/ class="[\d\w]*" /, ' ')
      svgXml = svgXml.replace(/ p-id="[\d\w]*" /, ' ')
      svgXml = svgXml.replace('viewBox="0 0 1024 1024"', 'viewBox="0 0 32 32"')
      // t="1514355212625" class="icon" style=""
      console.log(svgXml);
      if (err) reject(err)
      resolve({
        [filename.slice(0, filename.lastIndexOf('.'))]: svgXml,
      });
    });
  });
}

// 读取SVG文件夹下所有svg
function readSvgs() {
  return new Promise((resolve, reject) => {
    fs.readdir(svgDir, function (err, files) {
      if (err) reject(err)
      Promise.all(files.map(filename => readFile(filename)))
        .then(data => resolve(data))
        .catch(err => reject(err))
    });
  });
}

// 生成js文件
readSvgs().then(data => {
  let svgFile = 'export default ' + JSON.stringify(Object.assign.apply(this, data));
  fs.writeFile(path.resolve(__dirname, './src/assets/svgIcon.js'), svgFile, function (err) {
    if (err) throw new Error(err)
  })
}).catch(err => {
  throw new Error(err)
})
