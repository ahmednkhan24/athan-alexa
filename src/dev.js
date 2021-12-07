// eslint-disable-next-line @typescript-eslint/no-var-requires
const { main } = require('./logic');

const dev = async () => {
  const requests = await main();
  const filtered = requests.map((request) => ({
    scheduledTime: request.trigger.scheduledTime,
    message: request.alertInfo.spokenInfo.content[0].text
  }));

  // eslint-disable-next-line no-console
  console.log(filtered);
};

dev();
