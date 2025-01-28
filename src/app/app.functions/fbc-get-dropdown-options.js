const hubspot = require('@hubspot/api-client');

exports.main = async (context = {}) => {
    const hubspotClient = new hubspot.Client({
        accessToken: process.env['REACT_APP_ACCESS_TOKEN']
    });

    const { objectType, propertyName } = context.parameters;

    try {
        const apiResponse = await hubspotClient.crm.properties.coreApi.getByName(objectType, propertyName, false, null);

        const{options}=apiResponse;

        const dropDownOptionsRaw = JSON.parse(JSON.stringify(options, null, 2));
        const dropDownOptions=[];
        dropDownOptionsRaw.map((item)=>(
            dropDownOptions.push({label:item.label, value:item.value})
        ));

        return dropDownOptions;

    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }

};