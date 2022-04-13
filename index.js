const http = require("http");
const path = require("path");
const fs = require("fs");

// creating a server that gets a request (req) and response(res)
const server = http.createServer((req, res) => {
  // build file path -  directoryname/public/html or the requested url
  let filePath = path.join(
    __dirname,
    "public",
    req.url === "/" ? "index.html" : req.url
  );

  // Grabbing the extention of file requested and will be passed to the switch statement
  let extname = path.extname(filePath);
                                        
  // "text/html" is by default the content type unless proven other wise by the switch statement
  let contentType = "text/html";

  // The switch statement gets the extention type and set the content type base on the case it satisfies
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
  }
  //  the file is read 
  fs.readFile(filePath, (err, content) => {
     
    // if there is an error 
    if(err){
        // check to see if the error is 'ENOENT' meaning page not found
          if(err.code == 'ENOENT'){
            //   if 'ENOENT' is found the 404.html is loaded
            fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                res.writeHead(200, {'Content-Type':"text/html"});
                res.end(content, 'utf8');
          })
      }else{
          //if there is another error a 500 error will be sent 
          res.writeHead(500);
          res.end(`Server Error:${err.code}`);
      }
  }else {
    //   if it is successful a 200 is sent 
    res.writeHead(200, {'Content-Type': contentType});
    // the content of the file is sent
    res.end(content, 'utf8');
  }
    })       
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
