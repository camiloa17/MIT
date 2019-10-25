const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(`Public`));

const route = {root:`${__dirname}/Public/html/Front/`}

app.get('/', (req,res)=>{
    res.sendFile('index.html',route)
})

app.get('/checkout',(req,res)=>{
    res.sendFile('checkout.html',route)
})

app.listen(3000,()=>{
    console.log(`listening on port 3000`)
})