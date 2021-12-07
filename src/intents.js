/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
const generateRequests = require('./logic').main;

// const PERMISSIONS = ['alexa::alerts:reminders:skill:readwrite'];

const LaunchRequest_Handler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    const { responseBuilder } = handlerInput;
    const client = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
    // const { permissions } = handlerInput.requestEnvelope.context.System.user;
    // if (permissions && !permissions.consentToken) {
    //   return responseBuilder
    //     .speak(messages.NOTIFY_MISSING_PERMISSIONS)
    //     .withAskForPermissionsConsentCard(PERMISSIONS)
    //     .getResponse();
    // }
    try {
      const reminders = await generateRequests();

      if (!reminders) {
        return responseBuilder
          .speak('An error occurred with the prayer time a.p.i.')
          .getResponse();
      }

      console.log('requests: ', JSON.stringify(reminders));
      reminders.forEach(async (reminderRequest) => {
        try {
          const reminderResponse = await client.createReminder(reminderRequest);
          console.log(
            'reminderRequestResponse: ',
            JSON.stringify(reminderResponse)
          );
        } catch (err) {
          console.log(
            'There was an error creating reminder: ',
            JSON.stringify(reminderRequest)
          );
        }
      });

      return responseBuilder.withShouldEndSession(true).getResponse();
    } catch (error) {
      console.log('error: ', error);
      return responseBuilder
        .speak('An error occurred creating the reminders')
        .getResponse();
    }
  }
};

// Custom intent handler
const SetPrayerTimes_Handler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'SetPrayerTimes'
    );
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;

    const say = 'Hello from SetPrayerTimes.';
    const repromptOutput = ' Would you like another fact?';
    return responseBuilder.speak(say).reprompt(repromptOutput);
  }
};

// Required intent handler
const AMAZON_CancelIntent_Handler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.CancelIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Okay, talk to you later!')
      .withShouldEndSession(true)
      .getResponse();
  }
};

// Required intent handler
const AMAZON_StopIntent_Handler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.StopIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Okay, talk to you later!')
      .withShouldEndSession(true)
      .getResponse();
  }
};

// Required intent handler
const AMAZON_HelpIntent_Handler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Okay, talk to you later!')
      .withShouldEndSession(true)
      .getResponse();
  }
};

// Required intent handler
const AMAZON_NavigateHomeIntent_Handler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.NavigateHomeIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Okay, talk to you later!')
      .withShouldEndSession(true)
      .getResponse();
  }
};

// Required intent handler
const AMAZON_FallbackIntent_Handler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.FallbackIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Okay, talk to you later!')
      .withShouldEndSession(true)
      .getResponse();
  }
};

const SessionEndedHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Okay, talk to you later!')
      .withShouldEndSession(true)
      .getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Okay, talk to you later!')
      .withShouldEndSession(true)
      .getResponse();
  }
};

module.exports = {
  LaunchRequest_Handler,
  SetPrayerTimes_Handler,
  AMAZON_CancelIntent_Handler,
  AMAZON_StopIntent_Handler,
  AMAZON_HelpIntent_Handler,
  AMAZON_NavigateHomeIntent_Handler,
  AMAZON_FallbackIntent_Handler,
  SessionEndedHandler,
  ErrorHandler
};
