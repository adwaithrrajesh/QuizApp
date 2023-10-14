const { Router } = require('express');
const router = Router();
const {submitAnswer, addQuiz,getQuestion, getTop10Players} = require('../controller/quizController')
const multer = require('multer')

router.post('/addQuiz',multer().single('video'),addQuiz);
router.get('/getQuestion',getQuestion)
router.post('/submitAnswer',submitAnswer);
router.post('/getTop10Players',getTop10Players) 


module.exports = router;