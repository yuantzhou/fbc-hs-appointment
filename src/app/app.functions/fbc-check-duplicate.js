const hubspot = require('@hubspot/api-client');
exports.main = async (context = {}) => {
    console.log(`${context.parameters[1].AppointmentType} Appointment with ${context.parameters[0].value}`)
    console.log(context.parameters[1].TaxTerm)
    const hubspotClient = new hubspot.Client({
        accessToken: process.env['PRIVATE_APP_ACCESS_TOKEN']
    });

const PublicObjectSearchRequest = {  limit: 5, filterGroups: [{"filters":[
    {"propertyName":"appointment_name","value":`${context.parameters[1].AppointmentType} Appointment with ${context.parameters[0].firstname} ${context.parameters[0].lastname}`,"operator":"EQ"}, {"propertyName":"fbc_tax_term","value":context.parameters[1].TaxTerm,"operator":"EQ"}
                                                                            ]}] };
const objectType = "2-37739766";

try {
  const apiResponse = await hubspotClient.crm.objects.searchApi.doSearch(objectType, PublicObjectSearchRequest);
  console.log(Object.keys(apiResponse))

  let noDuplicate= false
  if(apiResponse["total"]==0){
    noDuplicate=true
    console.log("no dup")
  }else{
    console.log("duppppp")
    noDuplicate= false
  }
  return noDuplicate
} catch (e) {
  e.message === 'HTTP request failed'
    ? console.error(JSON.stringify(e.response, null, 2))
    : console.error(e)
}
    
}