const express = require('express');
const router = express.Router();
const mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dlibreman',
  database: 'beer'
});

connection.connect();


router.get('/sve', function(req, res){
  let query = 'select t.id, t.ime_komponente, t.kateg_id, sum(k.kolicina) kolicina from komponente t, komp_lok_kol k where t.id=k.komp_id group by t.id, t.ime_komponente, t.kateg_id';
  connection.query(query,function(err, rows, fields){
    if(err) throw err;

    res.render('sve_komponente',{
      rows:rows
    });
  });
});

router.get('/kategorije', function(req, res){
  let query = 'select id, ime_kategorije from kategorije_komponenti';
  connection.query(query,function(err, rows, fields){
    if(err) throw err;

    res.render('kategorije',{
      rows:rows
    });
  });

});

router.get('/kategorije/:id', function(req, res){
  let query = 'select t.id, t.ime_komponente, t.kateg_id, sum(k.kolicina) kolicina from komponente t, komp_lok_kol k where t.id=k.komp_id and t.kateg_id ='+req.params.id+' group by t.id,t.ime_komponente, t.kateg_id';
  connection.query(query,function(err, rows, fields){
    if(err) throw err;

    res.render('komp_po_kateg',{
      rows:rows
    });
  });

});

router.get('/kategorije/:id1/:id2', function(req, res){
  let query = 'select t.ime_komponente, t.kratak_opis_komp, k.kolicina, l.ime_lokacije from komponente t, komp_lok_kol k, lokacije l where t.id=k.komp_id and l.id=k.lok_id and t.id='+req.params.id2;
  connection.query(query,function(err, rows, fields){
    if(err) throw err;

    res.render('komponenta',{
      kategorija:req.params.id1,
      rows:rows
    });
  });

});

module.exports = router;
