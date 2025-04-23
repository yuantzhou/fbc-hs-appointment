const hubspot = require('@hubspot/api-client');

exports.main = async (context = {}) => {
    const hubspotClient = new hubspot.Client({
        accessToken: process.env['PRIVATE_APP_ACCESS_TOKEN']
    });

    const { objectId } = context.parameters;
    console.log(`Looking up contacts by account ID ${objectId}`);

    const objectType = "2-34986264";
    const properties = ["firstname","lastname", "email"];
    const propertiesWithHistory = undefined;
    const associations = [
    "0-1"
    ];
const archived = false;
const idProperty = undefined;

    try {
        const apiResponse = await hubspotClient.crm.objects.basicApi.getById(objectType, objectId, properties, propertiesWithHistory, associations, archived, idProperty);
        let Contacts= apiResponse.associations.contacts.results
        let DropdownOption = []
        for(let contact of Contacts){
            const contactCall = await hubspotClient.crm.contacts.basicApi.getById(contact.id, ["firstname","lastname", "email","address","phone"]);
            DropdownOption.push({label:contactCall.properties.firstname+" "+contactCall.properties.lastname,value:contactCall.properties.firstname+" "+contactCall.properties.lastname, type:contact.type, contactId:contact.id, 
                                firstname:contactCall.properties.firstname, lastname: contactCall.properties.lastname, email: contactCall.properties.email,address:contactCall.properties.address,phone:contactCall.properties.phone})
        }

        return DropdownOption;
       

            
}catch (e) {
    e.message === 'HTTP request failed'
        ? console.error(JSON.stringify(e.response, null, 2))
        : console.error(e)
}

}