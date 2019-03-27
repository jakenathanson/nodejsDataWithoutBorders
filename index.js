var twilio = require('twilio');
var moment = require('moment');
const Json2csvParser = require('json2csv').Parser;
const json2csv = require("json2csv").parse;
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.startFlow = functions.https.onRequest((req, res) => {
  // Grab the text parameter.

  const original = req.query.phone;
var ts = Math.round((new Date()).getTime() / 1000);
var num = "+"+original;
console.log(num);

const accountSid = 'KEY';
const authToken = 'KEY';
const client = require('twilio')(accountSid, authToken);

client.studio.flows('KEY')
             .executions
             .create({to: num, from: '+17207070840'})
             .then(execution => console.log(execution.sid))
             .done();

  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref(' /SurveySentLog').push({phone_number: original, timestamp: ts}).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  // return res.redirect(303, snapshot.ref.toString());
 return  res.status(200).send('Good');
  });
});





exports.sendReminder = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
const original = req.query.phone;
const password = req.query.password;
//var ts = Math.round((new Date()).getTime() / 1000);


var num = "+"+original;
console.log(num);
var ts = Math.round((new Date()).getTime() / 1000);

const accountSid = 'KEY';
const authToken = 'KEY';
const client = require('twilio')(accountSid, authToken);


client.messages
  .create({
     body: 'This is a reminder to please fill out the rest of the survey.',
     from: '+17207070840',
     to: num
   })
  .then(message => console.log(message.sid))
  .done();

  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/ReminderSentLog').push({phone_number: original, timestamp: ts}).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  // return res.redirect(303, snapshot.ref.toString());
 return  res.status(200).send('Reminder Sent');
  });
});

exports.getData = functions.https.onRequest((req, res) => {


  admin.database().ref('/ClinicList').once('value').then(function(snapshot) {
    res.send(snapshot);
  });



});


exports.getCSV = functions.https.onRequest((req, res) => {
  var tcsv=[];
  var data;
  var number = req.query.phone;
  admin.database().ref('/surveys').once('value').then(function(snapshot) {

    snapshot.forEach(function(childSnapshot) {

         text = childSnapshot.val();
         //tcsv.push(text);
         var phone = childSnapshot.val().phone_number;
         console.log(phone);

         if (number=="all"){
           tcsv.push(text);

         }

         if(phone==number){
           tcsv.push(text);
         }
     });
     console.log(tcsv.length);

     if(tcsv.length==0)
     {
       console.log("empty");
       res.status(200).send("No Results");
       process.exit();
     }

     const csv = json2csv(tcsv);
     res.set("Content-Type", "text/csv");
     res.status(200).send(csv);
     // var texty=tcsv.toString();
     // res.send(String(tcsv));
  });
});







exports.triggerSurveys = functions.https.onRequest((req, res) => {
  //https://stackoverflow.com/questions/39820091/how-to-get-properties-values-from-snapshot-val-or-snapshot-exportval-in-fi
  var phoneNumbers = [];
  var i;
  var text;
admin.database().ref('/ClinicList/').once('value').then(function(snapshot) {
snapshot.forEach(function(childSnapshot) {

     text = childSnapshot.val().phone_number;
     text = String(text);
     phoneNumbers.push(text);


 });
 var response = phoneNumbers.toString()

 for (i = 0; i < phoneNumbers.length; i++) {

 var original = phoneNumbers[i];
 var ts = Math.round((new Date()).getTime() / 1000);
 var num = "+"+original;
 //console.log(num);

 const accountSid = 'KEY';
 const authToken = 'KEY';
 const client = require('twilio')(accountSid, authToken);

 client.studio.flows('KEY')
              .executions
              .create({to: num, from: '+17207070840'})
              .then(execution => console.log(execution.sid))
              .done();

   // Push the new message into the Realtime Database using the Firebase Admin SDK.
  //  return admin.database().ref('/SurveySentLog').push({phone_number: original, timestamp: ts}).then((snapshot) => {
  //    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  //  // return res.redirect(303, snapshot.ref.toString());
  // //return  res.status(200).send('Good');
  //  });
 }

 res.send(response);


  });

});

exports.inputData = functions.https.onRequest((req, res) => {
  const dia_a5 = req.body.dia_a5;
  const dia_u5 = req.body.dia_u5;
  const nordt_a5 = req.body.nordt_a5;
  const nordt_u5 = req.body.nordt_u5;
  const phone_number = req.body.phone_number;
  const pneu_a5 = req.body.pneu_a5;
  const pneu_u5 = req.body.pneu_u5;
  const rdt_a5ntx = req.body.rdt_a5ntx;
  const rdt_a5tx = req.body.rdt_a5tx;
  const rdt_u5ntx = req.body.rdt_u5ntx;
  const rdt_u5tx = req.body.rdt_u5tx;
  const rdtp_a5 = req.body.rdt_u5tx;
  const rdtp_u5 = req.body.rdtp_u5;
  const stk = req.body.stk;
  const used = req.body.used;
  var ts = Math.round((new Date()).getTime() / 1000);

  //var textTime = moment().zone(120);
  //textTime = textTime.format('MMMM Do YYYY, h:mm:ss a');
  var textTime = moment().format("MMMM Do, YYYY");
  console.log(phone_number);
  //res.send(phone_number);
  var updatedPhoneNumber = phone_number.replace("+", "");
  //res.send(updatedPhoneNumber);

  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/surveys').push({
    timestamp: ts,
    textTime: textTime,
    phone_number: parseInt(updatedPhoneNumber),
    dia_a5: parseInt(dia_a5,10),
    dia_u5: parseInt(dia_u5,10),
    nordt_a5: parseInt(nordt_a5, 10),
    nordt_u5: parseInt(nordt_u5,10),
    pneu_a5: parseInt(pneu_a5, 10),
    pneu_u5: parseInt(pneu_u5,10),
    rdt_a5ntx: parseInt(rdt_a5ntx,10),
    rdt_a5tx : parseInt(rdt_a5tx,10),
    rdt_u5ntx: parseInt(rdt_u5ntx,10),
    rdt_u5tx: parseInt(rdt_u5tx,10),
    rdtp_a5: parseInt(rdtp_a5,10),
    rdtp_u5: parseInt(rdtp_u5,10),
    stk: parseInt(stk,10),
    used: parseInt(used,10)
  }).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  // return res.redirect(303, snapshot.ref.toString());
  return  res.status(200).send('Write Success');
  });




});
