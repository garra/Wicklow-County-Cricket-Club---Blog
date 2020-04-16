require ('./config')

const express     = require ('express')
const helmet      = require ('helmet');
const cors        = require ('cors')
const bodyParser  = require ('body-parser')
const mongoose    = require ('mongoose')
const Users       = require('./routes/User')
const Image       = require ('./routes/Image')
const RateLimit   = require('express-rate-limit');
const https       = require('https');
const fs          = require('fs');
const log4js      = require('log4js');

log4js.configure({
  appenders: { 'file': { type: 'file', filename: 'logs/loggers.log' , maxLogSize: 10485760, backups: 3, compress: true } },
  categories: { default: { appenders: ['file'], level: 'debug' } },
});

const logger = log4js.getLogger('loggers');

const app         = express ()
const port        = process.env.PORT || 5000

app.use (cors ())
app.use (bodyParser.json ())
app.use (
  bodyParser.urlencoded ({
    extended: false
  })
) 

/* only if you're behind a reverse proxy such as Heroku  */
app.enable('trust proxy'); 

var limiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes 
  max: 100, // Limit each IP to 100 requests per windowMs 
  delayMs: 0, // Disable delaying - full speed until the max limit is reached 
  message: 'Too many requests' //Message to send
});
 
//  apply to all requests 
app.use(limiter);

app.use (helmet.contentSecurityPolicy ({
  directives: {
    defaultSrc: ["'self'"], //Only load things that are from my own domain
    scriptSrc: ["'self'", "'unsafe-inline'"],  //Inline and self domain scripts can be loaded
    reportUri: '/report-violation',  //Instructs browser to post policy failure reports to this URI
    objectSrc: ["'none'"], //Defines valid sources of plugins
    upgradeInsecureRequests: true,
    formAction: ["'self"], //Source that can be used as HTML form
    workerSrc: false    // Restrcits URL loaded as Worker, SharedWorker
},
reportOnly: true,
}))

app.use (helmet.xssFilter ()) //  X-XSS-Protection header to prevent reflected XSS attacks
app.use (helmet.frameguard ({ action: 'deny' }))  // Don't allow to be in ANY frames
app.use(helmet.hidePoweredBy()); // Hides X-Prowered by from header

// Routes
app.use ('/users', Users)
app.use ('/blogs', Image)

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

mongoose
  .connect( 
    process.env.MONGO_URI,
    { useUnifiedTopology: true,
      useNewUrlParser: true
    }
  )
  .then(() => logger.info ('MongoDB Connected'))
  .catch(err => logger.error (err))

  https.createServer(options, app).listen(port, () => {
    logger.info ('Server listening at port: '+port)
  })

 
