import mongoose from 'mongoose';
import connectDB from '../../db/ConnectDB.js';

const { loginCredentialsConnection } = await connectDB();

const ResultsDetailsLayout = new mongoose.Schema({
    mobile: { type: Number, required: true }, // Mobile number of the                                                                                                       participant
    setAssigned:{ type: String}, // Set assigned to the participant (e.g., S01, S02, etc.)
    taskHistory: [{ type: String }], //constainsa code regarding evry task or activity performed by the participant 
    batteryStatus: { type: Number, required: true }, // Battery status of the participant quiz
    startedOn : { type: Date, required: true }, // Time when the quiz started
    submitedOn: { type: Date }, // Time when the quiz was completed
    frontendSecurityInteruptionCount: { type: Number, default: 0 }, // Count of frontend security interruptions
    rank: { type: Number, default: 0 }, // Rank of the participant in the quiz
    numberOfHintsUsed: { type: Number, default: 0 }, // Number of hints used by the participant
    numberOfWrongAttempts: { type: Number, default: 0 }, // Number of wrong attempts made by the participant
});

const ResultsDetailsSchema = loginCredentialsConnection.model('resultdetails', ResultsDetailsLayout);
export default ResultsDetailsSchema;


/*
The taskHistory array will store a code for every task or activity performed by the participant,
used to track their progress in the quiz.

Each entry is split into two parts:
1. Stationary data
2. Dynamic data

Stationary data:
1. Current ISO time
2. Set Name
3. Round Number

Example format (joined string):
2025-01-01T00:00:00ZS01R1

Dynamic data:
1. Battery Drained (e.g., 00, 01, 02, ..., 12, ...)
2. Task Code:
    UH - used hint
    WN - wrong numeric answer
    WM - wrong mcq answer
    CN - correct numeric answer
    CM - correct mcq answer
    XX - ignore
3. Frontend Security Interruption Data:
    FL - Frontend Locked (only used if there is a security breach)
    FO - Frontend Unlocked
    XX - ignore (used if there is no security breach)

Example format (joined string):
00UHXX

Both stationary and dynamic data are combined and stored as a single string in the taskHistory array.

Example:
Suppose a participant in Set S02, Round 3, at ISO time 2025-02-15T10:30:00Z, drains 03 battery, uses a hintt:

Stationary data:
2025-02-15T10:30:00ZS02R3

Dynamic data:
03UHXX

Combined entry for taskHistory:
"2025-02-15T10:30:00ZS02R303UHXX"

and if there is a frontend lock event (security breach)
"2025-02-15T10:30:00ZS02R300XXFL"


Note: FL will only be used if there is a security breach; otherwise, use XX to indicate it is ignored.
*/
