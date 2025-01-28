const hubspot = require('@hubspot/api-client');

exports.main = async (context = {}) => {
    const hubspotClient = new hubspot.Client({
        accessToken: process.env['REACT_APP_ACCESS_TOKEN']
    });

    try {
        const { objectId } = context.parameters;

        try {
            //Get found entity info
            const associatedEntityResults = await GetAccountAssociatedEntities(objectId, hubspotClient);
            const entityResults = await GetEntityInfo(associatedEntityResults, hubspotClient);

            var resultsSorted = entityResults.sort((a, b) => (a.properties.fbc_tax_entity_legal_name > b.properties.fbc_tax_entity_legal_name) ? 1 : -1);
            resultsSorted = resultsSorted.sort((a, b) => (a.properties.fbc_tax_entity_type > b.properties.fbc_tax_entity_type) ? 1 : -1);

            const primaryContactAssociations = await GetPrimaryEntityAssociationLabel(objectId, hubspotClient);

            const entityItems = [];
            var i = 0;
            while (i < resultsSorted.length) {
                const primaryContactFound = primaryContactAssociations.find(function (element) { return element.id == resultsSorted[i].properties.hs_object_id; });
                const primaryContactLabel = primaryContactFound ? " [ Primary Contact ] " : "";

                const entityTypeName = GetEntityTypeFullName(resultsSorted[i].properties.fbc_tax_entity_type);
                const item = { label: `${resultsSorted[i].properties.fbc_tax_entity_legal_name} ( ${entityTypeName} ) ${primaryContactLabel}`, value: resultsSorted[i].properties.hs_object_id };
                entityItems.push(item);
                i++;
            }

            return entityItems;

        } catch (e) {
            e.message === 'HTTP request failed'
                ? console.error(JSON.stringify(e.response, null, 2))
                : console.error(e)
        }

        return null;
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }
};

function GetEntityTypeFullName(fbc_tax_entity_type) {
    const taxEntityTypeFullName = [
        { code: "I", name: "Individual" },
        { code: "C", name: "Corporation" },
        { code: "P", name: "Partnership" },
        { code: "R", name: "T5013 Partnership" },
        { code: "T", name: "Trust" },
    ];

    const entityType = taxEntityTypeFullName.find(function (element) {
        return element.code == fbc_tax_entity_type;
    });

    return entityType.name;
}

function GetPortalEnvironment() {
    return process.env['ENVIRONMENT'];
}

async function GetAccountAssociatedEntities(objectId, hubspotClient) {
    try {
        const accountObjectType = "p_fbc_accounts";
        const associations = ["p_tax_entities"]; //entities associations

        const contactAssociations = await hubspotClient.crm.objects.basicApi.getById(accountObjectType, objectId, undefined, undefined, associations, false, undefined);
        const resultsRaw = JSON.parse(JSON.stringify(contactAssociations, null, 2));

        var associatedResults = null;
        if (GetPortalEnvironment() == "test") {
            //TEST
            const { results } = resultsRaw.associations.p45137012_tax_entities;
            associatedResults = results;
        }
        else {
            //PROD
            const { results } = resultsRaw.associations.p19545932_tax_entities;
            associatedResults = results;
        }

        return associatedResults;
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }
}

async function GetEntityInfo(associatedEntityResults, hubspotClient) {
    try {
        const BatchReadInputSimplePublicObjectId = { propertiesWithHistory: undefined, inputs: associatedEntityResults, properties: ["fbc_tax_entity_legal_name", "fbc_tax_entity_type"] };
        const entityObjectType = "p_tax_entities";
        const apiResponse = await hubspotClient.crm.objects.batchApi.read(entityObjectType, BatchReadInputSimplePublicObjectId, false);
        const { results } = apiResponse;

        return results;
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }
}

async function GetPrimaryEntityAssociationLabel(accountId, hubspotClient) {
    try {
        const ContactBatchInputPublicObjectId = { inputs: [{ "id": accountId }] };
        const fromAccountObjectType = "p_fbc_accounts";
        const toContactObjectType = "contact";

        const associatedContacts = await hubspotClient.crm.associations.batchApi.read(fromAccountObjectType, toContactObjectType, ContactBatchInputPublicObjectId);
        const { results: contactResults } = associatedContacts;
        const toContactArray = contactResults[0].to;

        const primaryContact = toContactArray.find(function (element) { return (element.type == 'fbc_primary_contact' || element.type == 'Association_fbc_accounts_Contact_0'); });

        if (primaryContact === undefined) return [];

        ///get contact links
        const EntityBatchInputPublicObjectId = { inputs: [{ "id": primaryContact.id }] };
        const fromContactObjectType = "contact";
        const toEntityObjectType = "p_tax_entities";
        const associatedEntity = await hubspotClient.crm.associations.batchApi.read(fromContactObjectType, toEntityObjectType, EntityBatchInputPublicObjectId);
        const { results: entityResults } = associatedEntity;
        const toEntityArray = entityResults[0].to;
        return toEntityArray;
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }
}