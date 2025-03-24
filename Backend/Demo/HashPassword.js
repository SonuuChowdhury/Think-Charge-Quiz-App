import bcrypt from 'bcrypt'

async function hashPassword(password) {
    const saltRounds = 10; // Number of salt rounds for hashing
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
}

export default hashPassword

// hashPassword("admin@password").then(console.log);
