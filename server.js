//server.js

/**
 * Base setup
 *
 * 
 */

//call the packages we need 
var express     = require('express');
var app         = express();
var bodyparser  = require('body-parser');

var mongoose    = require('mongoose');

//mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o');
mongoose.connect('mongodb://localhost/nodeapp');

var Bear        = require('./app/models/bear'); 

//configure app to use body-parser
//this will let us get the data from a post
app.use(bodyparser.urlencoded({
  extended:true
}));
app.use(bodyparser.json());

var port = process.env.PORT || 8080; //set up our port

/**
 *
 * Routes for our API
 * 
 */

var router = express.Router();  //get instance of express router

router.use(function(req, res, next){
  // do logging
  console.log('Something is happening...');
  next();
});

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)

router.get('/', function(req,res){
  res.json({ message: 'welcome to our api!' });
});


// more routes for our API will happen here

/**
 * REGISTER OUR ROUTES
 * all of our routes will be prefixed with /api
 */

router.route('/bears')
  .post(function(req, res) {
    var bear = new Bear();
    bear.name = req.body.name;
    console.log(req.body);

    bear.save(function(err){
      if(err){
        res.send(err);
      }

      res.json({message: 'Bear created!' + bear.name})
    });

  })

  .get(function(req,res){
    Bear.find(function(err, bears){
      if(err){
        res.send(err);
      }

      res.json(bears);
    });
  });

// on routes that end in /bears/:bear_id
router.route('/bears/:bear_id')

  .get(function(req, res){
    console.log(req.params);
    Bear.findById(req.params.bear_id, function(err,bear){
      if(err){
        res.send(err);
      }
      res.json(bear);
    });
  })

  .put(function(req,res){
    
    Bear.findById(req.params.bear_id, function(err,bear){
      if(err){
        res.send(err);
      }

      bear.name = req.body.name; //update the info

      bear.save(function(err){
        if(err){
          res.send(err);
        }
        res.json({message:'Bear updated'});
      });  
    });
  })

  .delete(function(req, res) {
          Bear.remove({
              _id: req.params.bear_id
          }, function(err, bear) {
              if (err)
                  res.send(err);

              res.json({ message: 'Successfully deleted' });
          });
      });



app.use('/api',router);

/**
 * Start the server
 */

app.listen(port);
console.log('listening on port ' + port + '...');




























