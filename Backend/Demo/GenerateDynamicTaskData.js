export default async function GenerateDynamicTaskData(taskInfo) {
    let taskString = '';
    if(taskInfo=='start'){
        taskString = '00XXXX';
    }else if(taskInfo=='hint'){
        taskString='04UHXX'
    }else if(taskInfo=='wrongnumber'){
        taskString='02WNXX'
    }else if(taskInfo=='wrongmcq'){
        taskString='02WMXX'
    }else if(taskInfo=='correctnumber'){
        taskString='00CNXX'
    }else if(taskInfo=='correctmcq'){
        taskString='02CMXX'
    }

    return taskString;
  }