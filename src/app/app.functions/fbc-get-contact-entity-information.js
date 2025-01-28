const hubspot = require('@hubspot/api-client');

exports.main = async (context = {}) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env['REACT_APP_ACCESS_TOKEN']
  });

  const { value } = context.parameters;

  const entityProperties = [
    "fbc_tax_entity_first_name",
    "fbc_tax_entity_last_name",
    "fbc_tax_entity_legal_name",
    "fbc_tax_entity_care_of",
    "fbc_tax_entity_range_road",
    "fbc_tax_entity_apartment",
    "fbc_tax_entity_street",
    "fbc_tax_entity_po_box",
    "fbc_tax_entity_city",
    "fbc_tax_entity_province_state",
    "fbc_tax_entity_country",
    "fbc_tax_entity_postal_code",
    "fbc_tax_entity_loc_plan_or_range_wom",
    "fbc_tax_entity_lot_quadrant",
    "fbc_tax_entity_lot_section",
    "fbc_tax_entity_township_concession",
    "fbc_tax_entity_date_of_birth",
    "fbc_date_of_death",
    "fbc_tax_entity_cra_business_number",
    "fbc_tax_entity_fiscal_year_end_day",
    "fbc_tax_entity_fiscal_year_end_month",
    "fbc_tax_entity_incorporation_date",
    "fbc_tax_entity_province_of_registration_incorporation",
    "fbc_tax_entity_on_farm_business_registration_number",
    "fbc_tax_entity_operating_as",
    "fbc_tax_entity_taxing_province",
    "fbc_tax_entity_provincial_corporate_tax_numbe",
    "fbc_tax_entity_pst_number",
    "fbc_tax_entity_phone_number",
    "fbc_tax_entity_email_address",
    "fbc_tax_entity_type",
    "hs_object_id",
    "fbc_entity_last_filed_return_year",
    "fbc_social_insurance_number",
    "fbc_tax_entity_marital_status",
    "fbc_tax_entity_start_date",
    "fbc_tax_entity_t5013_partnership",
    "fbc_tax_entity_gender"
  ];

  const contactProperties = [
    "alternate_phone",
    "mobilephone",
    "fax",
    "fbc_contact_do_not_use_internet_or_email",
    "nick_name",
    "fbc_contact_ontario_first_nation_sales_tax_exemption",
    "fbc_contact_status_indian_registration_number"
  ];

  const entityObjectType = process.env['TAX_ENTITY_TYPE_ID']; //tax entities
  const associations = ['0-1']; //contacts

  try {
    //get entity properties
    const entityApiResponse = await hubspotClient.crm.objects.basicApi.getById(entityObjectType, value, entityProperties, undefined, associations, false, undefined);
    const entityPropertiesResults = entityApiResponse.properties;

    var infoResponse = '';

    if (entityPropertiesResults.fbc_tax_entity_type === 'I' && entityApiResponse.associations !== undefined) {
      //return merged result for individual
      //get associated contact properties
      const { results } = entityApiResponse.associations.contacts;
      const { id } = results[0];
      const contactApiResponse = await hubspotClient.crm.contacts.basicApi.getById(id, contactProperties, undefined, undefined, false);
      const contactPropertiesResults = contactApiResponse.properties;

      //merge properties with spread
      infoResponse = { ...entityPropertiesResults, ...contactPropertiesResults };
    }
    else {
      //return entity result for non-individual
      infoResponse = entityPropertiesResults;
    }

    return infoResponse;

  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e)
  }
};