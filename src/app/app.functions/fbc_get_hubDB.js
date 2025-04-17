const hubspot = require('@hubspot/api-client');


const sort = undefined;
const after = undefined;
const limit = undefined;
const createdAt = undefined;
const createdAfter = undefined;
const createdBefore = undefined;
const updatedAt = undefined;
const updatedAfter = undefined;
const updatedBefore = undefined;
const contentType = undefined;
const archived = undefined;
exports.main = async (context = {}) => {
    const hubspotClient = new hubspot.Client({
        accessToken: process.env['PRIVATE_APP_ACCESS_TOKEN']
    });

    try {
        const apiResponse = await hubspotClient.cms.hubdb.tablesApi.getAllTables(sort, after, limit, createdAt, createdAfter, createdBefore, updatedAt, updatedAfter, updatedBefore, contentType, archived);
        return apiResponse
       
        

    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }

};
