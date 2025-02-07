const hubspot = require('@hubspot/api-client');

exports.main = async (context = {}) => {
    const hubspotClient = new hubspot.Client({
        accessToken: process.env['PRIVATE_APP_ACCESS_TOKEN']
    });
    const BatchReadInputPropertyName = { archived: false, inputs: [{"name":"preferred_meeting_location"},{"name":"appointment_type"}] };
const objectType = "2-37739766"
    try {
        const apiResponse = await hubspotClient.crm.properties.batchApi.read(objectType, BatchReadInputPropertyName);;
       
        return apiResponse

    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }

};