const async = require('async');
const request = require('request');
IP_URL = 'http://192.168.1.200:8011/vs/givehexgetcolor/'
BASE_URL = 'http://lightbuzz.in:3001/api/colors/'
var page=77;
var pageLimit = 24;
var access_token='access_token=an50G6tEtz6IOo7HrZkATDTspi9kIioddlCkGlB6GWaqGueVgksFV8T5qwFb2d3I';



var isJSON = function (str) {
   try {
       JSON.parse(str);
   } catch (e) {
       return false;
   }
   return true;
}
var postFunction = function (url, data, callback) {
  data.createdAt = new Date()
  request({
      method:'POST',
      url:url,
      headers : {
          "Content-Type" : "application/json"
      },
      body:JSON.stringify(data)
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          if (isJSON(body)) {
              callback(null,JSON.parse(body))
          }
      }
  });
}

var getFunction = function (url, callback) {
  request({
      method:'GET',
      url:url,
      headers : {
          "Content-Type" : "application/json"
      }
  }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          if (isJSON(body)) {
              callback(null,JSON.parse(body))
          }
      }
  });
}
var putFunction = function (url, data, callback) {
  data.updatedAt = new Date()
  request({
      method:'PUT',
      url:url,
      headers : {
          "Content-Type" : "application/json"
      },
      body:JSON.stringify(data)
  }, function (error, response, body) {
      // console.log(url);
      if (!error && response.statusCode == 200) {
          if (isJSON(body)) {
              callback(null,JSON.parse(body))
          }
      }else{
        callback(error)
      }
  });
}
var getColor=function (url,page)
{
      getFunction(url,function (err, colours) {
        async.mapSeries(colours,function(colour,cb){
        var d1= new Date();
        var hex = colour.hex
        var toSend = {}
        toSend.hex = hex
          postFunction(IP_URL,toSend,function (err,colorName) {
           var id=colour.id
           colour.name = colorName.colorName
           //console.log(colour.name);
           var PUT_URL=BASE_URL+id+'?'+access_token;
           putFunction(PUT_URL,colour,function(er,result)
             {
               var d2= new Date();
               var x= d2-d1;
               console.log(x/1000 + " "+ result.name +  " "+result.id +  " "+result.hex);
                cb(null,'');
            if(er)throw er;
             })
          })
    },function (err,results) {
        if(colours.length<24){
          console.log("Last Page");
          return;
          }
          else {
            console.log("page  no "+page + "ended");
            return getColor(BASE_URL+'?filter=%7B%22page%22%20%3A%20'+ ++page +'%7D&'+access_token,page);
          }
    })
  });
}
   console.log(page);
 getColor(BASE_URL+'?filter=%7B%22page%22%20%3A%20'+page+'%7D&'+access_token,page);
