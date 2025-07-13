export default async function GenerateDynamicTaskData(taskInfo) {
    let taskString = '';
    if(taskInfo=='start'){
        taskString = '00XXXX';
    }else if(taskInfo=='hint'){
        taskString='04UHXX'
    }

    return taskString;
  }