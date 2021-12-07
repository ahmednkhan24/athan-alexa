/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-var-requires */
import Alexa from 'ask-sdk-core';
import * as intents from './intents';

const skillBuilder = Alexa.SkillBuilders.custom();

export const handler = skillBuilder
  .addRequestHandlers(
    intents.AMAZON_CancelIntent_Handler,
    intents.AMAZON_HelpIntent_Handler,
    intents.AMAZON_StopIntent_Handler,
    intents.AMAZON_NavigateHomeIntent_Handler,
    intents.AMAZON_FallbackIntent_Handler,
    intents.SetPrayerTimes_Handler,
    intents.LaunchRequest_Handler,
    intents.SessionEndedHandler
  )
  .addErrorHandlers(intents.ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient())
  .withCustomUserAgent('cookbook/reminders/v1')
  .lambda();
