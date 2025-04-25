const hubspot = require('@hubspot/api-client');



exports.main = async (context = {}) => {
    const hubspotClient = new hubspot.Client({
        accessToken: process.env['PRIVATE_APP_ACCESS_TOKEN']
    });
    let TableInfos= []
    console.log(context.parameters.Tables)
    for(let table of context.parameters.Tables){
        const apiResponse = await hubspotClient.cms.hubdb.rowsApi.getTableRows(table);
        TableInfos.push({TableName:table,Rows:apiResponse.results})
    }
  return TableInfos

};
