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
// Get Most Recent Meeting 
// search range with 30s for all engagements 
const response = await axios.get(`https://api.hubapi.com/engagements/v1/engagements/recent/modified?count=100&since=${new Date().getTime()-172800000}`, 
// 30 second =30000 millisecond 
    {
    headers: {
      "authorization":`Bearer ${process.env['PRIVATE_APP_ACCESS_TOKEN']}`
    }
  });
  //filter engagment type= meeting, source = API, correct contact 
  let filteredMeeting = response.data.results.filter(obj=>obj.engagement.type=="MEETING"&&obj.engagement.source=="API"&&obj.associations.contactIds==context.parameters[2].contactId)
  //sort by most recent created 
  filteredMeeting.sort(function(a, b){return b.engagement.createdAt- a.engagement.createdAt})
  // for(let obj of filteredMeeting){
  //   console.log(obj.engagement.createdAt)
  //   // timestamp = scheduled time
  //   console.log(obj.engagement.timestamp)
  // }
  console.log(filteredMeeting[0].engagement.id)
  const properties = {
    "hs_meeting_outcome": "INVITED",
    "hs_meeting_title": `calendarEvent Id= ${context.parameters[3]}`
  };
  const SimplePublicObjectInput = { objectWriteTraceId: "string", properties };
  const meetingId = filteredMeeting[0].engagement.id;
  const idProperty = undefined;
  
  try {
    const apiResponse = await hubspotClient.crm.objects.meetings.basicApi.update(meetingId, SimplePublicObjectInput, idProperty);
    console.log(JSON.stringify(apiResponse, null, 2));
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e)
  }
  // 454 = appointment object to meetings
  const BatchInputPublicAssociation3 = { inputs: [{"_from":{"id":context.parameters[0]},"to":{"id":filteredMeeting[0].engagement.id},"type":"454"}] };
  try {
    const apiResponse3 = await hubspotClient.crm.associations.batchApi.create(fromObjectType, "meetings", BatchInputPublicAssociation3);
   
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e)
  }
}