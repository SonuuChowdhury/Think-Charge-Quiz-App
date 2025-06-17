export default function GetCurrentISTDate() {
    // Create a new Date object in UTC
    const nowUTC = new Date();
  
    // IST is UTC + 5:30, so add 5.5 hours in milliseconds
    const istOffsetInMs = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(nowUTC.getTime() + istOffsetInMs);
  
    return nowIST; // This can be directly stored in MongoDB
  }
