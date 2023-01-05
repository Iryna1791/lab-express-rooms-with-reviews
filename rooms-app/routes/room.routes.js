const express = require('express');
const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn")

// require the Room model here
const Room = require('../models/Room.model');
     //rooms
router.get('/', (req, res, next) => {
  // Iteration #2: List the room
  Room.find()
      .then(rooms => res.render('rooms/list', { rooms }))
      .catch(err => console.log(err))
});

router.get('/create', isLoggedIn, (req, res, next) => {
  // Add a new room
  console.log("when you click on create room",req.session.currentUser)
  res.render('rooms/create-form')
});

router.post('/create', (req, res, next) => {
  // Iteration #3: Add a new room
  const {name, description, imageUrl} = req.body;

  Room.create({
    name,
    description,
    imageUrl,
    owner : req.session.currentUser._id
   

  })
  .then(()=> res.redirect('/rooms'))
  .catch(err => console.log(err))
});

router.get('/:id/edit', (req, res, next) => {
  // Iteration #4: Update the rooms

  console.log("req.params",req.params)
  const { id } = req.params;


  Room.findById(id)
    .then(foundRoom => res.render('rooms/update-form', foundRoom))
    .catch(err => console.log(err))
  
});

router.post('/:id/edit', (req, res, next) => {
  // Iteration #4: Update the rooms
  const { name, description, imageUrl } = req.body;
  const { id } = req.params;

  Room.findByIdAndUpdate(id, {name, description, imageUrl})
      .then(() => res.redirect('/rooms'))
      .catch(err => console.log(err))
  
});

router.post('/:id/delete', (req, res, next) => {
  // Iteration #5: Delete the room
  const { id } = req.params;

  Room.findByIdAndDelete(id)
      .then(() => res.redirect('/rooms'))
      .catch(err => console.log(err))
});

// router.get('/list', (req, res) => {
//   Room.find()
//       .populate('owner')
//       .then((roomsList) => {
//           res.render('room/list', { roomsList })
//       })
//       .catch((err) => console.error(`Error while listing movies: ${err}`))
// })
module.exports = router;
