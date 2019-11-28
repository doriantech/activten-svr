var http = require("http")
var fs = require("fs")
function convertToVbDate(date) {
  var day = "0".repeat(2 - date.getDate().toString().length) + date.getDate().toString()
  var month = "0".repeat(2 - date.getMonth().toString().length) + date.getMonth().toString()
  var year = (1900 + date.getYear()).toString()
  return day + "." + month + "." + year;
}

function parseVbDate(date) {
  var day = parseInt(date.split(".")[0])
  var month = parseInt(date.split(".")[1])
  var year = parseInt(date.split(".")[2])
  return new Date(year,month,day)
}
http.createServer((req,res) => {
  try{
  var query = new URL("http://example.com/" + req.url).searchParams;
  //console.log()
  if(query.get("action") == "read") {
    var lics = JSON.parse(
          fs.readFileSync(
            unescape(query.get("pdct") + ".json")
            ).toString()
          ).licenses
    res.end(
      JSON.stringify(
        lics[query.get("key")][lics[query.get("key")].length-1]
        )
      )
  }
  if(query.get("action") == "write") {
    var lics = JSON.parse(
          fs.readFileSync(
            unescape(query.get("pdct") + ".json")
            ).toString()
          ).licenses
          if(lics[query.get("key")] == undefined) {
            lics[query.get("key")] = [];
          }
          var oa = JSON.parse(
          fs.readFileSync(
            unescape(query.get("pdct") + ".json")
            ).toString()
          )
          if(lics[query.get("key")].length >= oa.maxusesallowed) {
            res.end("FAIL")
          } else {
            lics[query.get("key")].push({begin:convertToVbDate(new Date())})
            oa.licenses = lics
            fs.writeFileSync(unescape(query.get("pdct") + ".json")
            ,JSON.stringify(oa))
            res.end("OK")
          }
    //res.end(
      //JSON.stringify(
        //lics[query.get("key")][lics[query.get("key")].length-1]
        //)
      //)
  }
  }catch(ex){
    res.end("")
  }
}).listen(8080)