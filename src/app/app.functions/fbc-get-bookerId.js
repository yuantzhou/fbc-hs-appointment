const hubspot = require('@hubspot/api-client');

const hubspotClient = new hubspot.Client({
    accessToken: process.env['PRIVATE_APP_ACCESS_TOKEN']
});
exports.main = async (context = {}) => {
    console.log(context.parameters[0].user.email)


const email = context.parameters[0].user.email;
const after = undefined;
const limit = 100;
const archived = false;

try {
  const apiResponse = await hubspotClient.crm.owners.ownersApi.getPage(email, after, limit, archived);
  console.log(JSON.stringify(apiResponse, null, 2));
  console.log(Object.keys(apiResponse.results[0]))
  console.log(typeof apiResponse)
  return apiResponse.results[0].id
} catch (e) {
  e.message === 'HTTP request failed'
    ? console.error(JSON.stringify(e.response, null, 2))
    : console.error(e)
}
}