const express = require('express');
const router = express.Router();
const mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dlibreman',
  database: 'beer',
  multipleStatements: true
});

connection.connect();

router.get('/dodaj', function(req,res){
  let query = 'select id, ime_kategorije from kategorije_komponenti; select * from lokacije';

  connection.query(query, [1,2], function(err, result){
    //console.log(result[0]);
    //console.log(result[1]);
    res.render('dodaj_komp', {
      kategorije:result[0],
      lokacije:result[1]
    });
  });
});

router.post('/dodaj', function(req, res){
  let query = "INSERT INTO `komponente` (`ime_komponente`, `kratak_opis_komp`, `kateg_id`) VALUES ('"+req.body.ime_komp+"','"+req.body.k_opis_komp+"',"+req.body.kateg+");";
  let query2 =  "INSERT INTO `komp_lok_kol` (`komp_id`, `lok_id`, `kolicina`) select id, "+req.body.lok+","+req.body.kol+" from komponente where ime_komponente='"+req.body.ime_komp+"'";

  //console.log(query);
  connection.query(query+query2,[1,2], function(err, result){
    if(err) throw err;
    req.flash('success','Komponenta dodana');
    res.redirect('/arduino/dodaj');
  });
  //console.log('ime_komponente je: '+req.body.ime_komp);
  //console.log('Kratki opis je: '+req.body.k_opis_komp);
  //onsole.log('kolicina je: '+req.body.kol);
  //console.log('Kategorija je: '+req.body.kateg);
  //console.log('lokacija je: '+req.body.lok);
  //console.log(query2);
});

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
