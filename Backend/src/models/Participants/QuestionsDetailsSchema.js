import mongoose from 'mongoose';
import connectDB from '../../db/ConnectDB.js';

const { loginCredentialsConnection } = await connectDB();

const QuestionsLayout = new mongoose.Schema({
    setName : { type: String, required: true }, // S01, S02, S03...
    totalRounds: { type: Number, required: true }, //3
    rounds:[{
        roundNumber: { type: Number, required: true }, //R1, R2, R3...
        questionType: { type: String, required: true }, // e.g., 'MCQ', 'Numerical'
        questionTitle: { type: String, required: true }, // e.g., 'What is the capital of France?'
        questionDescription: { type: String, required: true }, // e.g., 'Choose the correct answer from the options below.'
        assets: [{ type: String }], // link to the assets, e.g., images or videos related to the question
        codeAssets: { type: String }, // if a coding question , the code will be pasted here
        numericAnswer: { type: Number }, // if a numerical question, the answer will be pasted here
        options: [{ type: String }], // array of strings for options
        correctOptions: [{ type: String }], // array of strings for correct options
        hint: [{ type: String }], // array of strings for hints
    }]
});

const QuestionsDetailsSchema = loginCredentialsConnection.model('questiondetails', QuestionsLayout);
export default QuestionsDetailsSchema;
