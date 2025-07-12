export default async function GenerateStationaryTaskData(set,round) {
    // Get current timestamp in Indian Standard Time (IST)
    const nowUtc = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // Convert 5.5 hours to milliseconds
    const istTime = new Date(nowUtc.getTime() + istOffset);
    const time = istTime.toISOString()

    const taskString =  `${time}${set}${round}`
    return taskString;
  }