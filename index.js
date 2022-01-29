const fs = require('fs');
const http =require('http');
const url= require('url')

// reading all files synchronously on happens once when server is started actually

// reading data.json file here
const data= fs.readFileSync('./starter/dev-data/data.json', 'utf-8' );

// reading template-overview.html
const tempOverview =fs.readFileSync('./starter/templates/template-overview.html' , 'utf-8');

// reading template-card.html
const tempCard =fs.readFileSync('./starter/templates/template-card.html' , 'utf-8');


// reading template-product.html
const tempProduct =fs.readFileSync('./starter/templates/template-product.html' , 'utf-8');

// parsing data.json into js array that contains object of product details
const dataObj= JSON.parse(data);


const replaceTemplate=(temp , product)=>{
    let output= temp.replace(/{%PRODUCTNAME%}/g , product.productName);
    output=output.replace(/{%IMAGE%}/g , product.image);
    output=output.replace(/{%PRICE%}/g , product.price);
    output=output.replace(/{%FROM%}/g , product.from);
    output=output.replace(/{%NUTRIENTS%}/g , product.nutrients);
    output=output.replace(/{%QUANTITY%}/g , product.quantity);
    output=output.replace(/{%ID%}/g , product.id);
    output=output.replace(/{%DESCRIPTION%}/g , product.description);
    
    if(!product.organic){
    output=output.replace(/{%NOT_ORGANIC%}/g , "not-organic");

    }

    return output;
} 


// OUR SERVER
const server = http.createServer( (req, res)=>{
   

  // const path = req.url; 
   const {query , pathname:path}= url.parse(req.url , true) ;

  if( path=== '/' || path=== '/overview'){
      // overview page
    res.writeHead(200, {'Content-type':'text/html'});
    
    const cardHtml= dataObj.map(el => replaceTemplate(tempCard , el )).join('');

    const finalOutput= tempOverview.replace('{%PRODUCT_CARD%}' , cardHtml);
   // console.log(cardHtml);
    res.end(finalOutput);
  }else if(path=== '/product'){
      // product page
    res.writeHead(200 , {'Content-type' : 'text/html'});
    const product= dataObj[query.id];
    const output = replaceTemplate(tempProduct , product);
    res.end(output);
  }else if(path=== '/api'){
      //API page
    // here we will serve json data to user 
    res.writeHead(200 , {'Content-type' : 'application/json'});

        // sending response to user the data read from data.json
        res.end(data);
    
}else{
      res.writeHead(404 , { 
          'Content-type' : 'text/html',
          'own-header' : 'hye-node-server'
      });
      res.end('<h3>Page not found !!</h3>');
  }
});

server.listen(8000 ,'127.0.0.1' , ()=>{
    console.log('Listening to request on port 8000.');
})


