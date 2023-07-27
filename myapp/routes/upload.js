var express = require('express');
var router = express.Router();
var multer = require('multer');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }

}

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  // fileFilter:fileFilter
});

router.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');

});
router.post("/fileupload", upload.single('image'), function (req, res, next) {

  const filename = req.file.filename;
  res.json({
    message: "Image Uploaded Successfully",
    filename: filename
  });
});


router.route('/callback')
  .post(upload.single('json'), function (req, res) {
    try {
      var data = req.body.json ?? undefined;
      const SMTP_HOST='email-smtp.ap-south-1.amazonaws.com'
      SMTP_PORT=465
      SMTP_USER="AKIAZZVFYRXGUACHAIXF"
      SMTP_PASSWORD="BALdI4Kt2mJSOtuZpK1KXrOVtOfW6zEn1ChDngkn2ppo"
      SMTP_FROM_EMAIL="apps@absyz.com"
      
      var transporter = nodemailer.createTransport({
        host:SMTP_HOST,
        port: SMTP_USER,
        secure: true,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
        },
    });

      var mailOptions = {
        from: 'apps@absyz.com',
        to: 'adarsh.puthiyapurayil@absyz.com',
        subject: 'HelloSign Callback',
        text: ` Details : ${JSON.stringify(data)}`
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


      // if (data.event) {
      //   if (data.event.event_type == 'template_created') {

      //   }

      //   if (data.event.event_type == 'signature_request_sent') {
      //     console.log('Logging event metadata now:');
      //     console.log(data.event.event_metadata);
      //   }
      // }

      res.status(200);
      res.send('Hello API Event Received');

    } catch (e) {
      res.json({
        message: "Error",
        message: e.message
      });
    }
    // console.log('This is the callback body');





  });

module.exports = router;