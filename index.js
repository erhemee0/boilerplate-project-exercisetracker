const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  description: String,
  duration: Number,
  date: Date,
  log: [{}]
});
const User = mongoose.model("User", userSchema);


app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  var user = new User({ username: req.body.username });
  user.save()
    .then(data => {
      res.json({
        username: data.username,
        _id: data["_id"]
      })
    })
    .catch(err => {
      console.error(err);
    });
})
app.get("/api/users", (req, res) => {
  User.find().then(data => {
    res.json(data)
  }).catch(err => {
    console.error(err);
  })
})
app.post("/api/users/:_id/exercises", (req, res) => {
  let date = req.body.date
  console.log(req.body)
  if (!date) date = new Date()
  User.findByIdAndUpdate(req.body._id, { date: date, duration: req.body.duration, description: req.body.description }, { new: true })
    .then(data => {
      res.json({
        username: data.username,
        _id: data["_id"],
        date: date
      })
    })
    .catch(err => {
      console.error(err);
    });
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
