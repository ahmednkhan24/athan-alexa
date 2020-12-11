const Alexa = require('ask-sdk-core');
const intents = require('./intents');

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    intents.AMAZON_CancelIntent_Handler,
    intents.AMAZON_HelpIntent_Handler,
    intents.AMAZON_StopIntent_Handler,
    intents.HelloWorldIntent_Handler,
    intents.AMAZON_NavigateHomeIntent_Handler,
    intents.AMAZON_FallbackIntent_Handler,
    intents.SetPrayerTimes_Handler,
    intents.LaunchRequest_Handler,
    intents.SessionEndedHandler
  )
  .addErrorHandlers(intents.ErrorHandler)
  .addRequestInterceptors(intents.InitMemoryAttributesInterceptor)
  .addRequestInterceptors(intents.RequestHistoryInterceptor)
  .lambda();
