const createReminderRequest = (time, message) => {
  return {
    trigger: {
      type: 'SCHEDULED_ABSOLUTE',
      scheduledTime: time
    },
    alertInfo: {
      spokenInfo: {
        content: [
          {
            locale: 'en-US',
            text: message,
            ssml: `<speak>${message}</speak>`
          }
        ]
      }
    },
    pushNotification: {
      status: 'DISABLED'
    }
  };
};

module.exports = createReminderRequest;
