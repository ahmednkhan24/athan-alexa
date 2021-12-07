/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-var-requires */
import { SkillBuilders, DefaultApiClient } from 'ask-sdk-core';
import * as intents from './intents';

const skillBuilder = SkillBuilders.custom();

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
  .withApiClient(new DefaultApiClient())
  .withCustomUserAgent('cookbook/reminders/v1')
  .lambda();
