const Alexa = require('ask-sdk-core');
const generateRequests = require('./logic');

const messages = {
  WELCOME:
    'Welcome to the Reminders API Demo Skill!  You can say "create a reminder" to create a reminder.  What would you like to do?',
  WHAT_DO_YOU_WANT: 'What would you like to do?',
  NOTIFY_MISSING_PERMISSIONS:
    "Please enable Reminder permissions in the Amazon Alexa app using the card I've sent to your Alexa app.",
  ERROR: 'Uh Oh. Looks like something went wrong.',
  API_FAILURE: 'There was an error with the Reminders API.',
  GOODBYE: 'Bye! Thanks for using the Reminders API Skill!',
  UNHANDLED: "This skill doesn't support that. Please ask something else.",
  HELP: 'You can use this skill by asking something like: create a reminder?',
  REMINDER_CREATED: 'OK, I will remind you in 30 seconds.',
  UNSUPPORTED_DEVICE: "Sorry, this device doesn't support reminders.",
  WELCOME_REMINDER_COUNT:
    'Welcome to the Reminders API Demo Skill.  The number of your reminders related to this skill is ',
  NO_REMINDER: "OK, I won't remind you."
};

const PERMISSIONS = ['alexa::alerts:reminders:skill:readwrite'];

// Session Attributes
//   Alexa will track attributes for you, by default only during the lifespan of your session.
//   The history[] array will track previous request(s), used for contextual Help/Yes/No handling.
//   Set up DynamoDB persistence to have the skill save and reload these attributes between skill sessions.
function getMemoryAttributes() {
  const memoryAttributes = {
    history: [],
    // The remaining attributes will be useful after DynamoDB persistence is configured
    launchCount: 0,
    lastUseTimestamp: 0,
    lastSpeechOutput: {},
    nextIntent: []
    // "favoriteColor":"",
    // "name":"",
    // "namePronounce":"",
    // "email":"",
    // "mobileNumber":"",
    // "city":"",
    // "state":"",
    // "postcode":"",
    // "birthday":"",
    // "bookmark":0,
    // "wishlist":[],
  };
  return memoryAttributes;
}

const maxHistorySize = 20; // remember only latest 20 intents

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
        const reminderResponse = await client.createReminder(reminderRequest);
        console.log(
          'reminderRequestResponse: ',
          JSON.stringify(reminderResponse)
        );
      });

      return responseBuilder.withShouldEndSession(true).getResponse();
      // return responseBuilder.speak(messages.REMINDER_CREATED).getResponse();
    } catch (error) {
      console.log('error: ', error);
      return responseBuilder
        .speak('An error occurred creating the reminders')
        .getResponse();
    }
  }
};
// async handle(handlerInput) {
//   const requestEnvelope = handlerInput.requestEnvelope;
//   const responseBuilder = handlerInput.responseBuilder;
//   const consentToken = requestEnvelope.context.System.apiAccessToken;

//   console.log('consent token: ', consentToken);
//   const interfaces =
//     requestEnvelope.context.System.device.supportedInterfaces;

//   console.log('interfaces: ', interfaces);

//   const permissions = requestEnvelope.context.System.user.permissions;

//   console.log('permissions: ', permissions);

//   // return responseBuilder
//   //   .speak(messages.NOTIFY_MISSING_PERMISSIONS)
//   //   .withAskForPermissionsConsentCard(PERMISSIONS)
//   //   .getResponse();

//   try {
//     const client = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
//     const remindersResponse = await client.getReminders();
//     console.log(JSON.stringify(remindersResponse));

//     // reminders are retained for 3 days after they 'remind' the customer before being deleted
//     const remindersCount = remindersResponse.totalCount;

//     console.log('total count: ', remindersCount);

//     let say =
//       'hello' +
//       ' and welcome to ' +
//       invocationName +
//       '! Say help to hear some options.';

//     let skillTitle = capitalize(invocationName);

//     return responseBuilder
//       .speak(say)
//       .reprompt('try again, ' + say)
//       .withStandardCard(
//         'Welcome!',
//         'Hello!\nThis is a card for your skill, ' + skillTitle,
//         welcomeCardImg.smallImageUrl,
//         welcomeCardImg.largeImageUrl
//       )
//       .getResponse();
//   } catch (error) {
//     console.log(`error message: ${error.message}`);
//     console.log(`error stack: ${error.stack}`);
//     console.log(`error status code: ${error.statusCode}`);
//     console.log(`error response: ${error.response}`);
//   }
// }
// };
// handle(handlerInput) {
//   const responseBuilder = handlerInput.responseBuilder;
//   const accessToken =
//     handlerInput.requestEnvelope.context.System.user.accessToken;

//   if (!accessToken) {
//     const speak =
//       'Please use the Alexa companion app to authenticate with your Amazon account to start using the skill.';
//     return responseBuilder.speak(speak).withLinkAccountCard().getResponse();
//   }

//   let say =
//     'hello' +
//     ' and welcome to ' +
//     invocationName +
//     '! Say help to hear some options.';

//   let skillTitle = capitalize(invocationName);

//   return responseBuilder
//     .speak(say)
//     .reprompt('try again, ' + say)
//     .withStandardCard(
//       'Welcome!',
//       'Hello!\nThis is a card for your skill, ' + skillTitle,
//       welcomeCardImg.smallImageUrl,
//       welcomeCardImg.largeImageUrl
//     )
//     .getResponse();
// }
// };

const SetPrayerTimes_Handler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'SetPrayerTimes'
    );
  },
  async handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    const accessToken =
      handlerInput.requestEnvelope.context.System.user.accessToken;

    if (!accessToken) {
      const speak =
        'Please use the Alexa companion app to authenticate with your Amazon account to start using the skill.';
      return responseBuilder.speak(speak).withLinkAccountCard().getResponse();
    }

    let say = 'Hello from SetPrayerTimes.';

    const repromptOutput = ' Would you like another fact?';

    try {
      console.log('requesting data');

      // let params = {
      //   latitude: '42.01799659277165',
      //   longitude: '-88.20016064860027',
      //   method: 2,
      //   school: 1
      // };

      // const athanResponse = await athan.get('/timings', { params });

      // if (athanResponse.status !== 200) {
      //   responseBuilder
      //     .speak('I wasnt able to find a fact')
      //     .reprompt(repromptOutput);
      // }

      // const times = athanResponse.data.data.timings;

      const context = handlerInput.requestEnvelope.context;

      const apiEndpoint =
        handlerInput.requestEnvelope.context.System.apiEndpoint;

      const amazonUserResponse = await amazon.get('/user/profile', {
        params: { access_token: accessToken }
      });

      if (amazonUserResponse.status !== 200) {
        responseBuilder
          .speak('I wasnt able to find a fact')
          .reprompt(repromptOutput);
      }

      console.log('context: ', context);
      console.log('amazon user: ', amazonUserResponse);
      console.log('apiEndpoint: ', apiEndpoint);
      console.log('access token: ', accessToken);

      const { user_id } = amazonUserResponse.data;

      console.log('user_id: ', user_id);

      const response = await axios.get(
        `${apiEndpoint}/v1/alerts/reminders?customerId=${user_id}&creatorId=${user_id}`,
        {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('response: ', response);

      responseBuilder.speak(say).reprompt(repromptOutput);
    } catch (error) {
      console.log('error received: ', error);
      responseBuilder
        .speak('I wasnt able to find a fact')
        .reprompt(repromptOutput);
    }

    return responseBuilder.getResponse();
  }
};

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

const AMAZON_HelpIntent_Handler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    let sampleIntent = randomElement(getCustomIntents());
    let say = 'You asked for help.';
    say +=
      ' Heres something you can ask me, ' + getSampleUtterance(sampleIntent);

    return handlerInput.responseBuilder
      .speak(say)
      .reprompt('try again, ' + say)
      .getResponse();
  }
};

const AMAZON_NavigateHomeIntent_Handler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.NavigateHomeIntent'
    );
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;

    let say = 'Hello from AMAZON.NavigateHomeIntent. ';

    return responseBuilder
      .speak(say)
      .reprompt('try again, ' + say)
      .getResponse();
  }
};

const AMAZON_FallbackIntent_Handler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.FallbackIntent'
    );
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    let previousSpeech = getPreviousSpeechOutput(sessionAttributes);

    return responseBuilder
      .speak(
        'Sorry I didnt catch what you said, ' +
          stripSpeak(previousSpeech.outputSpeech)
      )
      .reprompt(stripSpeak(previousSpeech.reprompt))
      .getResponse();
  }
};

const SessionEndedHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`
    );
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.  Please say again.')
      .reprompt('Sorry, an error occurred.  Please say again.')
      .getResponse();
  }
};

// 2. Constants ===========================================================================

// Here you can define static data, to be used elsewhere in your code.  For example:
//    const myString = "Hello World";
//    const myArray  = [ "orange", "grape", "strawberry" ];
//    const myObject = { "city": "Boston",  "state":"Massachusetts" };

const APP_ID = undefined; // TODO replace with your Skill ID (OPTIONAL).

// 3.  Helper Functions ===================================================================

function capitalize(myString) {
  return myString.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
}

function randomElement(myArray) {
  return myArray[Math.floor(Math.random() * myArray.length)];
}

function stripSpeak(str) {
  return str.replace('<speak>', '').replace('</speak>', '');
}

const welcomeCardImg = {
  smallImageUrl:
    'https://s3.amazonaws.com/skill-images-789/cards/card_plane720_480.png',
  largeImageUrl:
    'https://s3.amazonaws.com/skill-images-789/cards/card_plane1200_800.png'
};

function getCustomIntents() {
  const modelIntents = model.interactionModel.languageModel.intents;

  let customIntents = [];

  for (let i = 0; i < modelIntents.length; i++) {
    if (
      modelIntents[i].name.substring(0, 7) != 'AMAZON.' &&
      modelIntents[i].name !== 'LaunchRequest'
    ) {
      customIntents.push(modelIntents[i]);
    }
  }
  return customIntents;
}

function getSampleUtterance(intent) {
  return randomElement(intent.samples);
}

function getPreviousSpeechOutput(attrs) {
  if (attrs.lastSpeechOutput && attrs.history.length > 1) {
    return attrs.lastSpeechOutput;
  } else {
    return false;
  }
}

const InitMemoryAttributesInterceptor = {
  process(handlerInput) {
    let sessionAttributes = {};
    if (handlerInput.requestEnvelope.session['new']) {
      sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

      let memoryAttributes = getMemoryAttributes();

      if (Object.keys(sessionAttributes).length === 0) {
        Object.keys(memoryAttributes).forEach(function (key) {
          // initialize all attributes from global list

          sessionAttributes[key] = memoryAttributes[key];
        });
      }
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    }
  }
};

const RequestHistoryInterceptor = {
  process(handlerInput) {
    const thisRequest = handlerInput.requestEnvelope.request;
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    let history = sessionAttributes['history'] || [];

    let IntentRequest = {};
    if (thisRequest.type === 'IntentRequest') {
      let slots = [];

      IntentRequest = {
        IntentRequest: thisRequest.intent.name
      };

      if (thisRequest.intent.slots) {
        for (let slot in thisRequest.intent.slots) {
          let slotObj = {};
          slotObj[slot] = thisRequest.intent.slots[slot].value;
          slots.push(slotObj);
        }

        IntentRequest = {
          IntentRequest: thisRequest.intent.name,
          slots: slots
        };
      }
    } else {
      IntentRequest = { IntentRequest: thisRequest.type };
    }
    if (history.length > maxHistorySize - 1) {
      history.shift();
    }
    history.push(IntentRequest);

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    AMAZON_CancelIntent_Handler,
    AMAZON_HelpIntent_Handler,
    AMAZON_StopIntent_Handler,
    AMAZON_NavigateHomeIntent_Handler,
    AMAZON_FallbackIntent_Handler,
    SetPrayerTimes_Handler,
    LaunchRequest_Handler,
    SessionEndedHandler
  )
  .addErrorHandlers(ErrorHandler)
  .addRequestInterceptors(InitMemoryAttributesInterceptor)
  .addRequestInterceptors(RequestHistoryInterceptor)
  .withApiClient(new Alexa.DefaultApiClient())
  .withCustomUserAgent('cookbook/reminders/v1')
  .lambda();

// End of Skill code -------------------------------------------------------------
// Static Language Model for reference

const model = {
  interactionModel: {
    languageModel: {
      invocationName: 'prayer times',
      modelConfiguration: {
        fallbackIntentSensitivity: {
          level: 'LOW'
        }
      },
      intents: [
        {
          name: 'AMAZON.CancelIntent',
          samples: []
        },
        {
          name: 'AMAZON.HelpIntent',
          samples: []
        },
        {
          name: 'AMAZON.StopIntent',
          samples: []
        },
        {
          name: 'HelloWorldIntent',
          slots: [],
          samples: [
            'hello',
            'how are you',
            'say hi world',
            'say hi',
            'hi',
            'say hello world',
            'say hello'
          ]
        },
        {
          name: 'AMAZON.NavigateHomeIntent',
          samples: []
        },
        {
          name: 'AMAZON.FallbackIntent',
          samples: []
        },
        {
          name: 'SetPrayerTimes',
          slots: [],
          samples: ['Set prayer times']
        },
        {
          name: 'LaunchRequest'
        }
      ],
      types: []
    }
  }
};
