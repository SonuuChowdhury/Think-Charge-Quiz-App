export default async function GetCurrentISTDate() {
    // Get current timestamp in Indian Standard Time (IST)
    const nowUtc = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // Convert 5.5 hours to milliseconds
    const istTime = new Date(nowUtc.getTime() + istOffset);
    
    // Format the time in IST
    const hours = String(istTime.getHours()).padStart(2, '0');
    const minutes = String(istTime.getMinutes()).padStart(2, '0');
    const seconds = String(istTime.getSeconds()).padStart(2, '0');
    
    // Create a new date object with the current date and IST time
    const currentDate = new Date();
    currentDate.setHours(parseInt(hours));
    currentDate.setMinutes(parseInt(minutes));
    currentDate.setSeconds(parseInt(seconds));
    console.log(`Time set to: ${hours}:${minutes}:${seconds} IST`);
    return currentDate;
}