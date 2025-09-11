const hubspot = require('@hubspot/api-client');


exports.main = async (context = {}) => {
    
  console.log(context);
  const hubspotClient = new hubspot.Client({
    accessToken: process.env['PRIVATE_APP_ACCESS_TOKEN']
});

 //[0] for contact information [1] for form information [2] context.crm [3] for booking information calendarEvent ID ${context.parameters[2]}, [4] Time Object,[5] BookingInfo
  let StartTime= context.parameters[4].PickedTime
 const duration = context.parameters[4].Duration*1  
 const endTime= new Date (StartTime).getTime()+new Number(duration)
 console.log(duration)
 console.log(new Date (endTime).toISOString())

 let deadline = new Date(StartTime).setDate( new Date(StartTime).getDate() + 3)
 console.log(deadline)
 console.log(context.parameters[4])
  let properties = {
    //[0] for contact information [1] for form information 
    "appointment_name": `${context.parameters[1]["Meeting Title"]}`,
    //all time properties has to be in ISOString format
    "appointment_start": `${new Date (StartTime).toISOString()}`,
     "appointment_end":`${new Date (endTime).toISOString()}`,
    "appointment_duration": duration/60000,
   "fbc_appointment_sub_type": `${context.parameters[1]["Appointment Sub Type"]}`,
   "fbc_appointment_main_type": `${context.parameters[1]["AppointmentType"]}`,
    "appointment_deadline_date_time": new Date(deadline).toISOString(),
    "meeting_description":`${context.parameters[1]["MeetingDesciption"]}`,
    "meeting_location": context.parameters[1].PreferredMeetingLocation,
    "fbc_tax_term": context.parameters[1].TaxTerm,
    // "calendar_event_id": context.parameters[3].response.calendarEventId,
    "fbc_appointment_api_infos": JSON.stringify(context.parameters[5]),
    "contact_phone_number": context.parameters[0].phone,
    "contacts_address":context.parameters[0].address,
    "fbc_appointment_booker":context.parameters[4].Booker,
    "hubspot_owner_id":context.parameters[4].Owner,
    "meeting_ouctome": "Scheduled",
    "appointment_recurring_frequency": context.parameters[4].recurring_period.trim()
  };
  
//  //514 is ad hoc association to the account 
  const SimplePublicObjectInputForCreate = { associations: [{"types":[{"associationCategory":"USER_DEFINED","associationTypeId":508},{"associationCategory":"USER_DEFINED","associationTypeId":514}],"to":{"id":"19997413735"}}], objectWriteTraceId: "string", properties };
//fbc appointment object id 
   const objectType = "2-37739766";
  
   
  
  try {
    const apiResponse = await hubspotClient.crm.objects.basicApi.create(objectType, SimplePublicObjectInputForCreate);
    let AppointmentID =JSON.parse(JSON.stringify(apiResponse, null, 2)).id;
    //const BatchInputPublicAssociation = { inputs: [{"_from":{"id":AppointmentID},"to":{"id":context.parameters[2].crm.objectId},"type":"514"}] };
    const BatchInputPublicAssociation = { inputs: [{"_from":{"id":AppointmentID},"to":{"id":context.parameters[2].crm.objectId},"type":"508"}] };
    // fbc appointment object 
    const fromObjectType = "2-37739766";
    //
    const toObjectType = context.parameters[2].crm.objectTypeId;
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