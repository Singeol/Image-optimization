import http from 'http';
import { doConvert } from './index.js'

const requestListener = function (req, res) {
  var a = (req.url).split("?")
  let options = {
    width: 0, 
    height: 0, 
    path: '', 
    codec: 'webp', 
    quality: 75
  }
  a.forEach(function(val) {
    let splitted = val.split("=")
    let key = splitted[0]
    let value = splitted[1]
    options[key] = value
  })
  console.log(options);
  const path = options.path;
  const width = parseInt(options.width);
  const height = parseInt(options.height);
  const codec = options.codec;
  const quality = parseInt(options.quality);
  doConvert(path, width, height, quality, codec);
  console.log(path, width, height, quality, codec)
  res.writeHead(200);
  res.end('OK');
}

const server = http.createServer(requestListener);
server.listen(8000, 'localhost');