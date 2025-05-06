const hubspot = require('@hubspot/api-client');
const axios=require( 'axios');

exports.main = async (context = {}) => {
    // context ={'appointmentID', object the card is interacting with (AccountId), selectedContactObject ,calendarEventId }
    console.log(context)
        const hubspotClient = new hubspot.Client({
            accessToken: process.env['PRIVATE_APP_ACCESS_TOKEN']
        });
// create a batch association, for upcoming association make another object in the same format in the array 
    const BatchInputPublicAssociation = { inputs: [{"_from":{"id":context.parameters[0]},"to":{"id":context.parameters[1].objectId},"type":"514"}] };
    // fbc appointment object 
    const fromObjectType = "2-37739766";
    //
    const toObjectType = context.parameters[1].objectTypeId;
    //only work with two object of the same type (e.g two company to assoicate), but can't associate to a different obect type (e.g) associate to a company and contact 
const BatchInputPublicAssociation2 = { inputs: [{"_from":{"id":context.parameters[0]},"to":{"id":context.parameters[2].contactId},"type":"476"}] };
try {
  const apiResponse = await hubspotClient.crm.associations.batchApi.create(fromObjectType, toObjectType, BatchInputPublicAssociation);
  //for contact 
  const apiResponse2 = await hubspotClient.crm.associations.batchApi.create(fromObjectType, "0-1", BatchInputPublicAssociation2);
 
} catch (e) {
  e.message === 'HTTP request failed'
    ? console.error(JSON.stringify(e.response, null, 2))
    : console.error(e)
}

}