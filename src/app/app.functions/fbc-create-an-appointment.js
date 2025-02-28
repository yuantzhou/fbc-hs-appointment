const hubspot = require('@hubspot/api-client');


exports.main = async (context = {}) => {
    
  // Get hs_object_id of the record in context
  const { hs_object_id } = context.propertiesToSend;
  console.log(context);
  const hubspotClient = new hubspot.Client({
    accessToken: process.env['PRIVATE_APP_ACCESS_TOKEN']
});

 //[0] for contact information [1] for form information [2] context.crm [3] for booking information calendarEvent ID ${context.parameters[2]}
  const passInDate=  context.parameters[1].StartDate
 const Hour= new Date(new Number(context.parameters[1].PickATime)).getHours()
 const min= new Date(new Number(context.parameters[1].PickATime)).getMinutes()
 const duration = context.parameters[1].Duration
 const endTime= new Date (`${passInDate} ${Hour}:${min}:25 GMT-0700 (Mountain Standard Time)`).getTime()+new Number(duration)
 console.log(duration)
 console.log(new Date (`${passInDate} ${Hour}:${min}:25 GMT-0700 (Mountain Standard Time)`).getTime())
 console.log(new Date (endTime).toISOString())
// console.log(duration)
// let endHour = Number(Math.floor(duration))+Number(Hour)
// console.log(endHour)
// let durationMinutes= "0."+(duration+ "").split(".")[1]
// if((durationMinutes*60+Number(min)).toString()=="NaN"){ 
//   durationMinutes= min
// }else{
//   durationMinutes=durationMinutes*60+Number(min)
//   if(durationMinutes>59){
//     endHour++
//     durationMinutes=durationMinutes-60
//   }
// }
 let deadline = new Date(passInDate).setDate(new Date(passInDate).getDate() + 3)
  const properties = {
    //[0] for contact information [1] for form information 
    "appointment_name": `${context.parameters[1].AppointmentType} Appointment with ${context.parameters[0].firstname} ${context.parameters[0].lastname}`,
    "appointment_start": `${new Date (`${passInDate} ${Hour}:${min}:25 GMT-0700 (Mountain Standard Time)`).toISOString()}`,
     "appointment_end":`${new Date (endTime).toISOString()}`,
    "appointment_duration": duration/60000,
    "appointment_type": context.parameters[1].AppointmentType,
    "appointment_deadline": deadline,
    "preferred_meeting_location": context.parameters[1].PreferredMeetingLocation,
    "fbc_tax_term": context.parameters[1].TaxTerm,
    "calendar_event_id": context.parameters[3].response.calendarEventId
  };
//  //514 is ad hoc association to the account 
  const SimplePublicObjectInputForCreate = { associations: [{"types":[{"associationCategory":"USER_DEFINED","associationTypeId":508},{"associationCategory":"USER_DEFINED","associationTypeId":514}],"to":{"id":"19997413735"}}], objectWriteTraceId: "string", properties };
//fbc appointment object id 
   const objectType = "2-37739766";
  
   
  
  try {
    const apiResponse = await hubspotClient.crm.objects.basicApi.create(objectType, SimplePublicObjectInputForCreate);
    let AppointmentID =JSON.parse(JSON.stringify(apiResponse, null, 2)).id;
    const BatchInputPublicAssociation = { inputs: [{"_from":{"id":AppointmentID},"to":{"id":context.parameters[2].objectId},"type":"514"}] };
    // fbc appointment object 
    const fromObjectType = "2-37739766";
    //
    const toObjectType = context.parameters[2].objectTypeId;
    //only work with two object of the same type (e.g two company to assoicate), but can't associate to a different obect type (e.g) associate to a company and contact 
const BatchInputPublicAssociation2 = { inputs: [{"_from":{"id":AppointmentID},"to":{"id":context.parameters[0].contactId},"type":"476"}] };

  try {
    const apiResponse = await hubspotClient.crm.associations.batchApi.create(fromObjectType, toObjectType, BatchInputPublicAssociation);
    //for contact 
    const apiResponse2 = await hubspotClient.crm.associations.batchApi.create(fromObjectType, "0-1", BatchInputPublicAssociation2);
   
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e)
  }
    return apiResponse;
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e)
  }
 
  
 
  
 
};