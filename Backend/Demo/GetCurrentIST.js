export default async function GetCureentIST() {
    // Get current timestamp in Indian Standard Time (IST)
    const nowUtc = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // Convert 5.5 hours to milliseconds
    const istTime = new Date(nowUtc.getTime() + istOffset);
    const time = istTime.toISOString()
    
    return time;
  }