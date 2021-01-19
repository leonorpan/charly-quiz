const express = require('express')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const app = express()

let QUESTIONS = []
let SCORE = 0;

app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    QUESTIONS = [];
    SCORE = 0;
  res.render('index', {
      title: 'Charly trivia quiz'
  })
})

app.post('/answer/:id', (req, res) => {
    const retrievedQuestion = QUESTIONS.filter(obj => obj.id == req.params.id)
    if(QUESTIONS.length == 30) {
        SCORE += 2 ** (req.body.round - 1)
        res.redirect('/you-won')
    } else if (retrievedQuestion[0] && req.body.answer_field.toLowerCase() == retrievedQuestion[0].answer.toLowerCase()) {
        SCORE += 2 ** (req.body.round - 1)
        res.redirect('/quiz/'+ (parseInt(req.body.round) + 1))
    } else {
        res.redirect('/game-over')
    }
  })

app.get('/game-over', (req, res) => {
    res.render('game-over', {
        title: 'Unfortunately, the game is over!',
        score: SCORE
    })
  })

  app.get('/you-won', (req, res) => {
    res.render('you-won', {
        title: 'Wow, you won!!!',
        score: SCORE
    })
  })

app.get('/quiz/:round', (req, res) => {
  fetch('http://jservice.io/api/random')
    .then(response => response.json())
    .then((question) => {
        console.log(question[0])
        QUESTIONS.push(question[0])
        res.render('question', {
            round: req.params.round,
            title: 'Quiz round: ' + req.params.round,
            question: question[0],
            score: SCORE
        })
    })
})


app.listen(3000, () => {
  console.log('Server listening at http://localhost:3000')
})
