const fs = require('fs');
const mongoose = require('mongoose');
const QuizQuestion = require('../model/questionShema');
const path = require('path');
const AWS = require('@aws-sdk/client-s3')
const objectCommand = require('@aws-sdk/client-s3')
const dotenv = require('dotenv')
const {getSignedUrl}  = require('@aws-sdk/s3-request-presigner')
dotenv.config();



module.exports = {
  addQuiz: async (req, res) => {
    const { options, correctAnswer, fullName, question } = req.body
    const video = req.file

    const s3Client = new AWS.S3Client({
      region: process.env.AWS_REGION, 
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const putObjectCommand = new AWS.PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${process.env.S3_FOLDER_NAME}/${video.originalname}`,
      Body:  video.buffer,
    });

    console.log(putObjectCommand)
    const response = await s3Client.send(putObjectCommand);

    const getObjectCommand = new objectCommand.GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${process.env.S3_FOLDER_NAME}/${video.originalname}`,
    });

    const presignedUrl = await getSignedUrl(s3Client, getObjectCommand);


    const newQuizQuestion = new QuizQuestion({
            fullName,
            options,
            correctAnswer,
            question,
            video: presignedUrl
          });
          const save = await newQuizQuestion.save()
          console.log(save)
          if (save) return res.status(200).json({ msg: "Question saved successfully" })
          else return res.status(500).json({ msg: "Unable to save the question" })
  },

  getQuestion: async (req, res) => {
    try {
      const questions = await QuizQuestion.find();
      if (questions.length > 0) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        const randomQuestion = questions[randomIndex];
        return res.status(200).json(randomQuestion)
      } else {
        return res.status(500).json({ msg: "No Quiz Found" })
      }
    } catch (error) {
      return res.status(500).json({ msg: "internal Server Error" })
    }
  },

  submitAnswer: async (req, res) => {
    const { selectedOption, accurateTime, fullName, quizId } = req.body;
    try {
      const quiz = await QuizQuestion.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      if (quiz.correctAnswer === selectedOption) {
        const newTopPlayer = {
          playerName: fullName,
          time: accurateTime
        };
        quiz.topPlayers.push(newTopPlayer);
        await quiz.save();
        return res.status(200).json({ message: "Answer submitted and saved." });
      } else {
        return res.status(200).json({ message: "Answer submitted, but it is not correct." });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error submitting the answer." });
    }
  },

  getTop10Players: async (req, res) => {
    try {
      
      const { quizId } = req.body
      const { topPlayers } = await QuizQuestion.findOne({ _id: quizId })
      topPlayers.sort((a, b) => a.time - b.time);
      const top10Players = topPlayers.slice(0, 10);
      console.log(top10Players)
      res.status(200).json(top10Players)
    } catch (error) {
      res.status(500).json({message:"Internal server error"})
    }
  }

}