const bcrypt = require('bcryptjs');
const router = require("express").Router();
const saltRounds = 10;

const User = require('../models/User.model');

/* GET Signup page */
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req,res) => {
    const { fullName, password, email } = req.body;
 
    // make sure users fill all mandatory fields:
    if (!fullName || !password || !email) {
      res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
      return;
    }

    // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  User.create({fullName, email, password: passwordHash})
      .then((newUser) => {
      res.redirect(`/auth/login`)
      })
      .catch(err => console.log(err))
})

router.get('/login', (req, res) => {
    
    res.render('auth/login')
})

router.post('/login', (req, res) => {
    
    const { password, email } = req.body;
    console.log('req.body', req.body)
//    Data validation check 
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }

  User.findOne({ email })
    .then(user => { // --> { username: '', email: '', password: ''} || null
        console.log('user', user)
      if (!user) { // if user is not found in the DB
        res.render('auth/login', { errorMessage: 'Username is not registered. Try with other email.' });
        return;
      } else if (bcrypt.compareSync(password, user.password)) { // if password is correct
        // res.redirect(`/auth/profile/${user.username}`)
        // res.render('auth/profile', user);
        
        req.session.currentUser =  user ; // creating the property currentUser 
        console.log( "the req.sessio",req.session.currentUser)
        res.redirect('/auth/profile')
        
      } else { // if password is incorect
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => console.log(error));
})

router.get('/profile', (req, res) => {
    console.log(req.session.currentUser)
    res.render('auth/profile', {user: req.session.currentUser})
})

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) console.log(err);
      res.redirect('/');
    });
  });

module.exports = router;