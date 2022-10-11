import http from 'http';
import url from 'url';
import { existsSync, readFileSync } from 'node:fs';
import { doConvert } from './optimize.js'

const requestListener = function (req, res) {
  const urlParsed = url.parse(req.url, true);
  let path = urlParsed.pathname;
  if (/[a-zA-Z0-9].(jpg|jpeg|png|bmp|avif|webp)/.test(path)) {
    if (existsSync('./images' + path)) {
      var img = readFileSync('./images' + path);
      res.writeHead(200, {'Content-Type': 'image/jpg' });
      res.end(img, 'binary');
    }
    else {
      try {
        let name = path.substring(1, path.search(/[0-9]/));
        let buf = path.substring(path.search(/[0-9]/));
        let width = parseInt(buf.substring(0, buf.indexOf('.')));
        let codec = buf.substring(buf.indexOf('.') + 1);
        codec = (codec === 'jpg' | codec === 'jpeg') ? 'mozjpeg' : codec;
        doConvert(name, width, codec);
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(img, 'binary');
      }
      catch (err) {
        console.log(err);
      }
      
    }
  }

}

const server = http.createServer(requestListener);
server.listen(8000, 'localhost');