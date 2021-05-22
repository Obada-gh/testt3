'use strict';

require('dotenv').config();
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodeOver = require('method-override');
const cors = require('cors');
const { render } = require('ejs');

const app = express();
app.use(cors());
app.use(methodeOver('_method'));
app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');


const clinet = new pg.Client(process.env.DATABASE_URL);



app.get('/',(req,res)=>{
  let url = `https://digimon-api.vercel.app/api/digimon`;
  superagent(url).then((data)=>{
    let digimonD= data.body;
    let digimonMap = digimonD.map((item)=>{


      return new DigimonCons(item);

    });
    return res.render('pages/index',{digimonMap});
  });

});

function DigimonCons(data){
  this.name=data.name;
  this.img=data.img;
  this.level=data.level;
}

app.post('/addTofav',(req,res)=>{

  let {name,img,level}=req.body;
  console.log(req.body);
  let sql = 'INSERT INTO digimon (name,img,level) VALUES ($1,$2,$3);';
  let val = [name,img,level];
  clinet.query(sql,val).then(()=>{
    return res.redirect('/fav');

  });


});

app.get('/fav',(req,res)=>{
  let sql='SELECT * FROM digimon;';
  clinet.query(sql).then((data)=>{

    return res.render('pages/fav',{records:data.rows});
  });

});

app.get('/details/:id',(req,res)=>{
  let sql='SELECT * FROM digimon WHERE id=$1;';
  let val= [req.params.id];
  clinet.query(sql,val).then((data)=>{

    return res.render('pages/details',{records:data.rows[0]});
  });

});

app.put('/update/:id',(req,res)=>{
  let {name,img,level}=req.body;
  let sql='UPDATE digimon SET name = $1, img = $2, level=$3 WHERE id=$4;';
  let val= [name,img,level,req.params.id];
  clinet.query(sql,val).then(()=>{

    return res.redirect(`/details/${req.params.id}`);
  });

});

app.delete('/delete/:id',(req,res)=>{
  let sql='DELETE  FROM digimon WHERE id=$1;';
  let val= [req.params.id];
  clinet.query(sql,val).then(()=>{

    return res.redirect('/fav');
  });

});

const PORT = process.env.PORT || 7000;

clinet.connect().then(()=>{
  app.listen(PORT,()=>{
    console.log(`i am on port ${PORT}`);
  });
});







