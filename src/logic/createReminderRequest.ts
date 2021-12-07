const createReminderRequest = (time: string, message: string) => ({
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
});

export default createReminderRequest;
