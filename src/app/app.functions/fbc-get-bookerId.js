const hubspot = require('@hubspot/api-client');


exports.main = async (context = {}) => {
    const hubspotClient = new hubspot.Client({
        accessToken: process.env['PRIVATE_APP_ACCESS_TOKEN']
    });
    console.log(context.parameters[0].user.email)
    console.log(context.parameters[1].properties.hs_email)

const email = context.parameters[0].user.email;
const after = undefined;
const limit = 100;
const archived = false;
let owners={}

try {
    // apicall 2= for owner
  const apiResponse = await hubspotClient.crm.owners.ownersApi.getPage(email, after, limit, archived);
  const apiResponse2= await hubspotClient.crm.owners.ownersApi.getPage(context.parameters[1].properties.hs_email, after, limit, archived);
  console.log(JSON.stringify(apiResponse, null, 2));
  console.log(Object.keys(apiResponse.results[0]))
  console.log(typeof apiResponse)
  owners.booker=apiResponse.results[0].id
owners.AppointmentBooker= apiResponse2.results[0].id
  return owners
  
} catch (e) {
  e.message === 'HTTP request failed'
    ? console.error(JSON.stringify(e.response, null, 2))
    : console.error(e)
}
}