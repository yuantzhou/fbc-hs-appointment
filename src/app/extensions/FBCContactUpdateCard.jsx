import React, { useEffect, useState } from "react";
import {
  LoadingButton,
  Text,
  Input,
  Flex,
  hubspot,
  Divider,
  DateInput,
  Tile,
  Select,
  LoadingSpinner,
  Box,
} from "@hubspot/ui-extensions";

// Define the extension to be run within the Hubspot CRM
hubspot.extend(({ context, runServerlessFunction, actions }) => (
  <Extension
    context={context}
    runServerless={runServerlessFunction}
    refreshObjectProperties={actions.refreshObjectProperties}
    sendAlert={actions.addAlert}
    actions={actions}
  />
));

// Define the Extension component, taking in runServerless, context, & sendAlert as props
const Extension = ({ runServerless, sendAlert, actions, refreshObjectProperties }) => {
  const {
    fetchCrmObjectProperties,
  } = actions;

  const [selectDoNotUseInternetOrEmailOptions, setSelectDoNotUseInternetOrEmailOptions] = useState([]);
  const [selectContactOptions, setSelectContactOptions] = useState([]);
  const [selectCountryOptions, setSelectCountryOptions] = useState([]);
  const [selectProvinceNROptions, setSelectProvinceNROptions] = useState([]);
  const [selectProvinceOptions, setSelectProvinceOptions] = useState([]);
  const [selectStateOptions, setSelectStateOptions] = useState([]);
  const [showCanada, setShowCanada] = useState(false);
  const [showUS, setShowUS] = useState(false);
  const [showRegion, setShowRegion] = useState(false);
  const [selectONFirstNationExemptionOptions, setSelectONFirstNationExemptionOptions] = useState([]);
  const [selectTaxingProvinceOptions, setSelectTaxingProvinceOptions] = useState([]);
  const [selectProvinceOfRegistrationOptions, setSelectProvinceOfRegistrationOptions] = useState([]);
  const [selectMaritalStatusOptions, setSelectMaritalStatusOptions] = useState([]);
  const [isIndividual, setIsIndividual] = useState(false);
  const [isPartnership, setIsPartnership] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [entitySelected, setEntitySelected] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickName, setNickName] = useState('');

  var [phoneNumber, setPhoneNumber] = useState('');
  const handlePhoneInput = e => {
    const formattedNumber = formatPhoneNumber(e);
    const trimmedString = formattedNumber.substring(0, 12);
    setPhoneNumber(trimmedString);
    return formattedNumber;
  }

  var [mobileNumber, setMobileNumber] = useState('');
  const handleMobilePhoneInput = e => {
    const formattedNumber = formatPhoneNumber(e);
    const trimmedString = formattedNumber.substring(0, 12);
    setMobileNumber(trimmedString);
    return formattedNumber;
  }

  var [alternateNumber, setAlternateNumber] = useState('');
  const handleAlternatePhoneInput = e => {
    const formattedNumber = formatPhoneNumber(e);
    const trimmedString = formattedNumber.substring(0, 12);
    setAlternateNumber(trimmedString);
    return formattedNumber;
  }

  var [faxNumber, setFaxNumber] = useState('');
  const handleFaxPhoneInput = e => {
    const formattedNumber = formatPhoneNumber(e);
    const trimmedString = formattedNumber.substring(0, 12);
    setFaxNumber(trimmedString);
    return formattedNumber;
  }

  const [email, setEmail] = useState('');
  const [doNotUseEmail, setDoNotUseEmail] = useState('');
  const [careOf, setCareOf] = useState('');
  const [apartment, setApartment] = useState('');
  const [street, setStreet] = useState('');
  const [rangeRoad, setRangeRoad] = useState('');
  const [poBox, setPOBox] = useState('');
  const [country, setCountry] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [locPlan, setLocPlan] = useState('');
  const [lotQuadrant, setLotQuadrant] = useState('');
  const [lotSection, setLotSection] = useState('');
  const [townshipConcession, setTownshipConcession] = useState('');
  const [legalName, setLegalName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(undefined);
  const [onFirstNationExemption, setONFirstNationExemption] = useState('');
  const [statusIndianRegistrationNumber, setStatusIndianRegistrationNumber] = useState('');
  const [taxingProvince, setTaxingProvince] = useState('');
  const [operatingAs, setOperatingAs] = useState('');
  const [incorporationDate, setIncorporationDate] = useState(undefined);
  var [fiscalYearEndMonth, setFiscalYearEndMonth] = useState('');
  var [fiscalYearEndDay, setFiscalYearEndDay] = useState('');
  const [craBusinessNumber, setCRABusinessNumber] = useState('');
  const [onFarmBusinessNumber, setONFarmBusinessNumber] = useState('');
  const [provincialCorporateTaxNumber, setProvincialCorporateTaxNumber] = useState('');
  const [pstNumber, setPSTNumber] = useState('');
  const [provinceOfRegistration, setProvinceOfRegistration] = useState('');
  const [entityRecordId, setEntityRecordId] = useState('');
  const [entityType, setEntityType] = useState('');
  var [lastFiledYear, setLastFiledYear] = useState('');
  var [sinNumber, setSINNumber] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [startDate, setStartDate] = useState(undefined);
  const [isT5013Partnership, setIsT5013Partnership] = useState(false);
  const [gender, setGender] = useState('');
  const [dateOfDeath, setDateOfDeath] = useState(undefined);

  const [fiscalYearEndMonthValid, setFiscalYearEndMonthValid] = useState(true);
  const [fiscalYearEndDayValid, setFiscalYearEndDayValid] = useState(true);
  const [legalNameValid, setLegalNameValid] = useState(true);
  const [firstNameValid, setFirstNameValid] = useState(true);
  const [lastNameValid, setLastNameValid] = useState(true);
  const [lastFiledYearValid, setLastFiledYearValid] = useState(true);
  const [streetValid, setStreetValid] = useState(true);
  const [poBoxValid, setPOBoxValid] = useState(true);
  const [cityValid, setCityValid] = useState(true);
  const [countryValid, setCountryValid] = useState(true);
  const [provinceValid, setProvinceValid] = useState(true);
  const [postalCodeValid, setPostalCodeValid] = useState(true);
  const [sinValid, setSINValid] = useState(true);
  const [taxingProvinceValid, setTaxingProvinceValid] = useState(true);
  const [provinceOfIncorporationValid, setProvinceOfIncorporationValid] = useState(true);
  const [dateOfRegistrationValid, setDateOfRegistrationValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [craBusinessNumberValid, setCRABusinessNumberValid] = useState(true);
  const [startDateValid, setStartDateValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const [alternatePhoneValid, setAlternatePhoneValid] = useState(true);
  const [faxValid, setFaxValid] = useState(true);
  const [mobileValid, setMobileValid] = useState(true);
  const [dateOfBirthValid, setDateOfBirthValid] = useState(true);
  const [onFarmBusinessValid, setONFarmBusinessValid] = useState(true);
  const [provincialCorporateTaxNumberValid, setProvincialCorporateTaxNumberValid] = useState(true);
  const [pstNumberValid, setPSTNumberValid] = useState(true);
  const [indianStatusValid, setIndianStatusValid] = useState(true);
  const [dateOfDeathValid, setDateOfDeathValid] = useState(true);

  const [fiscalYearEndMonthValidationMessage, setFiscalYearEndMonthValidationMessage] = useState('');
  const [fiscalYearEndDayValidationMessage, setFiscalYearEndDayValidationMessage] = useState('');
  const [legalNameValidationMessage, setLegalNameValidationMessage] = useState('');
  const [firstNameValidationMessage, setFirstNameValidationMessage] = useState('');
  const [lastNameValidationMessage, setLastNameValidationMessage] = useState('');
  const [lastFiledYearValidationMessage, setLastFiledYearValidationMessage] = useState('');
  const [streetValidationMessage, setStreetValidationMessage] = useState('');
  const [poBoxValidationMessage, setPOBoxValidationMessage] = useState('');
  const [cityValidationMessage, setCityValidationMessage] = useState('');
  const [countryValidationMessage, setCountryValidationMessage] = useState('');
  const [provinceValidationMessage, setProvinceValidationMessage] = useState('');
  const [postalCodeValidationMessage, setPostalCodeValidationMessage] = useState('');
  const [sinValidationMessage, setSINValidationMessage] = useState('');
  const [taxingProvinceValidationMessage, setTaxingProvinceValidationMessage] = useState('');
  const [provinceOfIncorporationValidationMessage, setProvinceOfIncorporationValidationMessage] = useState('');
  const [dateOfRegistrationValidationMessage, setDateOfRegistrationValidationMessage] = useState('');
  const [craBusinessNumberValidationMessage, setCRABusinessNumberValidationMessage] = useState('');
  const [emailValidationMessage, setEmailValidationMessage] = useState('');
  const [startDateValidationMessage, setStartDateValidationMessage] = useState('');
  const [phoneValidationMessage, setPhoneValidationMessage] = useState('');
  const [alternatePhoneValidationMessage, setAlternatePhoneValidationMessage] = useState('');
  const [mobileValidationMessage, setMobileValidationMessage] = useState('');
  const [faxValidationMessage, setFaxValidationMessage] = useState('');
  const [dateOfBirthValidationMessage, setDateOfBirthValidationMessage] = useState('');
  const [onFarmBusinessValidationMessage, setONFarmBusinessValidationMessage] = useState('');
  const [provincialCorporateTaxNumberValidationMessage, setProvincialCorporateTaxNumberValidationMessage] = useState('');
  const [pstNumberValidationMessage, setPSTNumberValidationMessage] = useState('');
  const [indianStatusValidationMessage, setIndianStatusValidationMessage] = useState('');
  const [dateOfDeathValidationMessage, setDateOfDeathValidationMessage] = useState('');

  useEffect(async () => {
    setIsLoading(true);

    await runServerless({ name: 'getDropDownOptions', parameters: { propertyName: 'fbc_contact_do_not_use_internet_or_email', objectType: 'contacts' } }).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          setSelectDoNotUseInternetOrEmailOptions(serverlessResponse.response);
        }
      }
    );

    await runServerless({ name: 'getDropDownOptions', parameters: { propertyName: 'fbc_tax_entity_country', objectType: 'p_tax_entities' } }).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          setSelectCountryOptions(serverlessResponse.response);
        }
      }
    );

    await runServerless({ name: 'getDropDownOptions', parameters: { propertyName: 'fbc_tax_entity_state', objectType: 'p_tax_entities' } }).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          setSelectStateOptions(serverlessResponse.response);
        }
      }
    );

    await runServerless({ name: 'getDropDownOptions', parameters: { propertyName: 'fbc_tax_entity_non_resident', objectType: 'p_tax_entities' } }).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          setSelectProvinceNROptions(serverlessResponse.response);
        }
      }
    );

    await runServerless({ name: 'getDropDownOptions', parameters: { propertyName: 'fbc_tax_entity_taxing_province', objectType: 'p_tax_entities' } }).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          setSelectProvinceOptions(serverlessResponse.response);
          setSelectTaxingProvinceOptions(serverlessResponse.response);
        }
      }
    );

    await runServerless({ name: 'getDropDownOptions', parameters: { propertyName: 'fbc_tax_entity_province_of_registration_incorporation', objectType: 'p_tax_entities' } }).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          setSelectProvinceOfRegistrationOptions(serverlessResponse.response);
        }
      }
    );

    await runServerless({ name: 'getDropDownOptions', parameters: { propertyName: 'fbc_contact_ontario_first_nation_sales_tax_exemption', objectType: 'contacts' } }).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          setSelectONFirstNationExemptionOptions(serverlessResponse.response);
        }
      }
    );

    await runServerless({ name: 'getDropDownOptions', parameters: { propertyName: 'fbc_tax_entity_marital_status', objectType: 'p_tax_entities' } }).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          setSelectMaritalStatusOptions(serverlessResponse.response);
        }
      }
    );

    fetchCrmObjectProperties(['hs_object_id']).then(async (properties) => {
      await runServerless({ name: 'getAssociatedContacts', parameters: { objectId: properties.hs_object_id } }).then(
        (serverlessResponse) => {
          if (serverlessResponse.status == 'SUCCESS') {
            setSelectContactOptions(serverlessResponse.response);
          }
        }
      );
    });

    setIsLoading(false);
  }, []);

  const handleClick = async () => {
    ResetValidation();

    var invalidFields = '';
    invalidFields = SubmissionValidation();

    if (invalidFields.length > 0) {
      invalidFields = invalidFields.trim();
      invalidFields = invalidFields.slice(0, -1);
    }

    if (invalidFields != '') {
      sendAlert({ message: `Invalid input, please fix the following fields: ${invalidFields}.` });
      return;
    }

    setIsPosting(true);

    //fiscal year end defaults to dec 31 if not set
    if (!isIndividual && (fiscalYearEndMonth === undefined || fiscalYearEndMonth === null || fiscalYearEndMonth === '' || fiscalYearEndDay === undefined || fiscalYearEndDay === null || fiscalYearEndDay === '')) {
      fiscalYearEndMonth = '12';
      fiscalYearEndDay = '31';
    }

    //sin defaults to 999999999 if not set
    if (isIndividual && (sinNumber === undefined || sinNumber === null || sinNumber === '')) {
      sinNumber = '999999999';
    }

    //lastfiled defaults to 1915 if not set
    if (isIndividual && (lastFiledYear === undefined || lastFiledYear === null || lastFiledYear === '')) {
      lastFiledYear = 1915;
    }

    await runServerless({
      name: 'contactUpdate', parameters: {
        firstName: firstName,
        lastName: lastName,
        nickName: nickName,
        phoneNumber: phoneNumber,
        mobileNumber: mobileNumber,
        alternateNumber: alternateNumber,
        faxNumber: faxNumber,
        email: email,
        doNotUseEmail: doNotUseEmail,
        careOf: careOf,
        apartment: apartment,
        street: street,
        rangeRoad: rangeRoad,
        poBox: poBox,
        country: country,
        province: province,
        city: city,
        postalCode: postalCode,
        locPlan: locPlan,
        lotQuadrant: lotQuadrant,
        lotSection: lotSection,
        townshipConcession: townshipConcession,
        legalName: legalName,
        dateOfBirth: dateOfBirth,
        onFirstNationExemption: onFirstNationExemption,
        statusIndianRegistrationNumber: statusIndianRegistrationNumber,
        taxingProvince: taxingProvince,
        operatingAs: operatingAs,
        incorporationDate: incorporationDate,
        fiscalYearEndMonth: fiscalYearEndMonth,
        fiscalYearEndDay: fiscalYearEndDay,
        craBusinessNumber: craBusinessNumber,
        onFarmBusinessNumber: onFarmBusinessNumber,
        provincialCorporateTaxNumber: provincialCorporateTaxNumber,
        pstNumber: pstNumber,
        provinceOfRegistration: provinceOfRegistration,
        entityRecordId: entityRecordId,
        isIndividual: isIndividual,
        entityType: entityType,
        lastFiledYear: lastFiledYear,
        sinNumber: sinNumber,
        maritalStatus: maritalStatus,
        startDate: startDate,
        isT5013Partnership: isT5013Partnership,
        gender: gender,
        dateOfDeath: dateOfDeath,
      }
    }).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          refreshObjectProperties();

          sendAlert({ message: 'Contact Updated' });
        } else {
          sendAlert({ message: `Error Updating Information ${serverlessResponse.message}` });
        }

        setIsPosting(false);
      }
    );
  };

  return (
    <>
      {isLoading &&
        <LoadingSpinner label="Loading..." layout="centered" />
      }

      {!isLoading &&
        <Tile compact={true}>
          <Text>Some of this information will be synced with iFirm after submission.</Text>
          <Select
            options={selectContactOptions}
            label="Select a tax entity from the drop down to edit it's information."
            name="choose-contact"
            onChange={async (value) => {
              await runServerless({
                name: 'getContactEntityInformation',
                parameters: { value },
              }).then(
                (serverlessResponse) => {
                  if (serverlessResponse.status == 'SUCCESS') {
                    const infoResponse = serverlessResponse.response;

                    const dobValue = ExtractDateFromDateString(infoResponse.fbc_tax_entity_date_of_birth);
                    const dodValue = ExtractDateFromDateString(infoResponse.fbc_date_of_death);
                    const dateOfIncorporationValue = ExtractDateFromDateString(infoResponse.fbc_tax_entity_incorporation_date);
                    const startDateValue = ExtractDateFromDateString(infoResponse.fbc_tax_entity_start_date);

                    ResetValidation();

                    setShowCanada(false);
                    setShowUS(false);
                    setShowRegion(false);

                    if (infoResponse.fbc_tax_entity_country == 'CA') {
                      setShowCanada(true);
                    } else if (infoResponse.fbc_tax_entity_country == 'US') {
                      setShowUS(true);
                    } else if (infoResponse.fbc_tax_entity_country == 'NA') {
                      setShowRegion(true);
                    }

                    //bind properties
                    setFirstName(infoResponse.fbc_tax_entity_first_name === null || infoResponse.fbc_tax_entity_first_name === undefined ? '' : infoResponse.fbc_tax_entity_first_name);
                    setLastName(infoResponse.fbc_tax_entity_last_name === null || infoResponse.fbc_tax_entity_last_name === undefined ? '' : infoResponse.fbc_tax_entity_last_name);
                    setNickName(infoResponse.nick_name === null || infoResponse.nick_name === undefined ? '' : infoResponse.nick_name);
                    setAlternateNumber(infoResponse.alternate_phone === null || infoResponse.alternate_phone === undefined ? '' : infoResponse.alternate_phone);
                    setApartment(infoResponse.fbc_tax_entity_apartment === null || infoResponse.fbc_tax_entity_apartment === undefined ? '' : infoResponse.fbc_tax_entity_apartment);
                    setCRABusinessNumber(infoResponse.fbc_tax_entity_cra_business_number === null || infoResponse.fbc_tax_entity_cra_business_number === undefined ? '' : infoResponse.fbc_tax_entity_cra_business_number);
                    setCareOf(infoResponse.fbc_tax_entity_care_of === null || infoResponse.fbc_tax_entity_care_of === undefined ? '' : infoResponse.fbc_tax_entity_care_of);
                    setCity(infoResponse.fbc_tax_entity_city === null || infoResponse.fbc_tax_entity_city === undefined ? '' : infoResponse.fbc_tax_entity_city);
                    setCountry(infoResponse.fbc_tax_entity_country === null || infoResponse.fbc_tax_entity_country === undefined ? '' : infoResponse.fbc_tax_entity_country);
                    setDateOfBirth(dobValue);
                    setDateOfDeath(dodValue);
                    setDoNotUseEmail(infoResponse.fbc_contact_do_not_use_internet_or_email === null || infoResponse.fbc_contact_do_not_use_internet_or_email === undefined ? '' : infoResponse.fbc_contact_do_not_use_internet_or_email);
                    setEmail(infoResponse.fbc_tax_entity_email_address === null || infoResponse.fbc_tax_entity_email_address === undefined ? '' : infoResponse.fbc_tax_entity_email_address);
                    setFaxNumber(infoResponse.fax === null || infoResponse.fax === undefined ? '' : infoResponse.fax);
                    setPhoneNumber(infoResponse.fbc_tax_entity_phone_number === null || infoResponse.fbc_tax_entity_phone_number === undefined ? '' : infoResponse.fbc_tax_entity_phone_number);
                    setFiscalYearEndDay(infoResponse.fbc_tax_entity_fiscal_year_end_day === null || infoResponse.fbc_tax_entity_fiscal_year_end_day === undefined ? '' : infoResponse.fbc_tax_entity_fiscal_year_end_day);
                    setMobileNumber(infoResponse.mobilephone === null || infoResponse.mobilephone === undefined ? '' : infoResponse.mobilephone);
                    setFiscalYearEndMonth(infoResponse.fbc_tax_entity_fiscal_year_end_month === null || infoResponse.fbc_tax_entity_fiscal_year_end_month === undefined ? '' : infoResponse.fbc_tax_entity_fiscal_year_end_month);
                    setIncorporationDate(dateOfIncorporationValue);
                    setLegalName(infoResponse.fbc_tax_entity_legal_name === null || infoResponse.fbc_tax_entity_legal_name === undefined ? '' : infoResponse.fbc_tax_entity_legal_name);
                    setLocPlan(infoResponse.fbc_tax_entity_loc_plan_or_range_wom === null || infoResponse.fbc_tax_entity_loc_plan_or_range_wom === undefined ? '' : infoResponse.fbc_tax_entity_loc_plan_or_range_wom);
                    setLotQuadrant(infoResponse.fbc_tax_entity_lot_quadrant === null || infoResponse.fbc_tax_entity_lot_quadrant === undefined ? '' : infoResponse.fbc_tax_entity_lot_quadrant);
                    setLotSection(infoResponse.fbc_tax_entity_lot_section === null || infoResponse.fbc_tax_entity_lot_section === undefined ? '' : infoResponse.fbc_tax_entity_lot_section);
                    setONFarmBusinessNumber(infoResponse.fbc_tax_entity_on_farm_business_registration_number === null || infoResponse.fbc_tax_entity_on_farm_business_registration_number === undefined ? '' : infoResponse.fbc_tax_entity_on_farm_business_registration_number);
                    setONFirstNationExemption(infoResponse.fbc_contact_ontario_first_nation_sales_tax_exemption === null || infoResponse.fbc_contact_ontario_first_nation_sales_tax_exemption === undefined ? '' : infoResponse.fbc_contact_ontario_first_nation_sales_tax_exemption);
                    setOperatingAs(infoResponse.fbc_tax_entity_operating_as === null || infoResponse.fbc_tax_entity_operating_as === undefined ? '' : infoResponse.fbc_tax_entity_operating_as);
                    setPOBox(infoResponse.fbc_tax_entity_po_box === null || infoResponse.fbc_tax_entity_po_box === undefined ? '' : infoResponse.fbc_tax_entity_po_box);
                    setPSTNumber(infoResponse.fbc_tax_entity_pst_number === null || infoResponse.fbc_tax_entity_pst_number === undefined ? '' : infoResponse.fbc_tax_entity_pst_number);
                    setPostalCode(infoResponse.fbc_tax_entity_postal_code === null || infoResponse.fbc_tax_entity_postal_code === undefined ? '' : infoResponse.fbc_tax_entity_postal_code);
                    setProvince(infoResponse.fbc_tax_entity_province_state === null || infoResponse.fbc_tax_entity_province_state === undefined ? '' : infoResponse.fbc_tax_entity_province_state);
                    setProvinceOfRegistration(infoResponse.fbc_tax_entity_province_of_registration_incorporation === null || infoResponse.fbc_tax_entity_province_of_registration_incorporation === undefined ? '' : infoResponse.fbc_tax_entity_province_of_registration_incorporation);
                    setProvincialCorporateTaxNumber(infoResponse.fbc_tax_entity_provincial_corporate_tax_numbe === null || infoResponse.fbc_tax_entity_provincial_corporate_tax_numbe === undefined ? '' : infoResponse.fbc_tax_entity_provincial_corporate_tax_numbe);
                    setRangeRoad(infoResponse.fbc_tax_entity_range_road === null || infoResponse.fbc_tax_entity_range_road === undefined ? '' : infoResponse.fbc_tax_entity_range_road);
                    setStreet(infoResponse.fbc_tax_entity_street === null || infoResponse.fbc_tax_entity_street === undefined ? '' : infoResponse.fbc_tax_entity_street);
                    setTaxingProvince(infoResponse.fbc_tax_entity_taxing_province === null || infoResponse.fbc_tax_entity_taxing_province === undefined ? '' : infoResponse.fbc_tax_entity_taxing_province);
                    setTownshipConcession(infoResponse.fbc_tax_entity_township_concession === null || infoResponse.fbc_tax_entity_township_concession === undefined ? '' : infoResponse.fbc_tax_entity_township_concession);
                    setStatusIndianRegistrationNumber(infoResponse.fbc_contact_status_indian_registration_number === null || infoResponse.fbc_contact_status_indian_registration_number === undefined ? '' : infoResponse.fbc_contact_status_indian_registration_number);
                    setEntityType(infoResponse.fbc_tax_entity_type === null || infoResponse.fbc_tax_entity_type === undefined ? '' : infoResponse.fbc_tax_entity_type);
                    setEntityRecordId(value);
                    setLastFiledYear(infoResponse.fbc_entity_last_filed_return_year === null || infoResponse.fbc_entity_last_filed_return_year === undefined ? '' : infoResponse.fbc_entity_last_filed_return_year);
                    setSINNumber(infoResponse.fbc_social_insurance_number === null || infoResponse.fbc_social_insurance_number === undefined ? '' : infoResponse.fbc_social_insurance_number);
                    setMaritalStatus(infoResponse.fbc_tax_entity_marital_status === null || infoResponse.fbc_tax_entity_marital_status === undefined ? '' : infoResponse.fbc_tax_entity_marital_status);
                    setStartDate(startDateValue);
                    setIsT5013Partnership(infoResponse.fbc_tax_entity_t5013_partnership);
                    setGender(infoResponse.fbc_tax_entity_gender === null || infoResponse.fbc_tax_entity_gender === undefined ? '' : infoResponse.fbc_tax_entity_gender);

                    if (infoResponse.fbc_tax_entity_type === 'I') {
                      setIsIndividual(true);
                    } else {
                      setIsIndividual(false);
                    }

                    if (infoResponse.fbc_tax_entity_type === 'P' || infoResponse.fbc_tax_entity_type === 'R') {
                      setIsPartnership(true);
                    } else {
                      setIsPartnership(false);
                    }
                  }
                }
              );

              setEntitySelected(true);
            }}
          />
          <Divider></Divider>

          {!entitySelected &&
            <Text format={{ fontWeight: 'bold' }}>Select an entity from the drop down menu above first.</Text>
          }

          {entitySelected &&
            <>
              <Text format={{ fontWeight: 'bold' }}>Contact Information</Text>
              <Text>This will create a new contact. Required fields are marked with *.</Text>
            </>
          }

          {entitySelected && isIndividual &&
            <Flex direction="row" align="end" gap="extra-small">
              <Input name="text" label="First Name" value={firstName}
                required={true}
                onChange={(value) => { setFirstName(value.toUpperCase()) }}
                error={!firstNameValid}
                validationMessage={firstNameValidationMessage}
                onInput={(value) => {
                  if (isIndividual && value === '') {
                    setFirstNameValidationMessage('First name is required for individual contacts');
                    setFirstNameValid(false);
                  } else {
                    setFirstNameValidationMessage('');
                    setFirstNameValid(true);
                  }
                }}
              />
              <Input name="text" label="Last Name" value={lastName}
                required={true}
                onChange={(value) => { setLastName(value.toUpperCase()) }}
                error={!lastNameValid}
                validationMessage={lastNameValidationMessage}
                onInput={(value) => {
                  if (isIndividual && value === '') {
                    setLastNameValidationMessage('Last name is required for individual contacts');
                    setLastNameValid(false);
                  } else {
                    setLastNameValidationMessage('');
                    setLastNameValid(true);
                  }
                }}
              />
              <Input name="text" label="Nick Name" value={nickName} onChange={(value) => { setNickName(value.toUpperCase()) }} />
            </Flex>
          }
          {entitySelected && !isIndividual &&
            <Flex direction="row" align="end" gap="extra-small">
              <Box flex={1}>
                <Input name="text" label="Legal Name" value={legalName}
                  required={true}
                  onChange={(value) => { setLegalName(value.toUpperCase()) }}
                  error={!legalNameValid}
                  validationMessage={legalNameValidationMessage}
                  onInput={(value) => {
                    if (!isIndividual && value === '') {
                      setLegalNameValidationMessage('Legal name is required for non-individual contacts');
                      setLegalNameValid(false);
                    } else {
                      setLegalNameValidationMessage('');
                      setLegalNameValid(true);
                    }
                  }}
                />
              </Box>
              <Box flex={1}>
                <Input name="text" label="Operating As" value={operatingAs} onChange={(value) => { setOperatingAs(value.toUpperCase()) }} />
              </Box>
            </Flex>
          }
          {entitySelected &&
            <>
              <Divider></Divider>
              <Text>Just type the phone number, dashes will be inserted.</Text>
              <Flex direction="row" align="end" gap="extra-small">
                <Input name="text" label="Phone Number" value={phoneNumber} description="Format: xxx-xxx-xxxx"
                  onChange={(value) => {
                    var formattedNumber = handlePhoneInput(value);

                    if (!IsValidPhone(formattedNumber)) {
                      setPhoneValidationMessage('Phone is invalid, format is xxx-xxx-xxxx');
                      setPhoneValid(false);
                    } else {
                      setPhoneValidationMessage('');
                      setPhoneValid(true);
                    }
                  }}
                  error={!phoneValid}
                  validationMessage={phoneValidationMessage}
                />
                <Input name="text" label="Mobile Number" value={mobileNumber} description="Format: xxx-xxx-xxxx"
                  onChange={(value) => {
                    var formattedNumber = handleMobilePhoneInput(value);

                    if (!IsValidPhone(formattedNumber)) {
                      setMobileValidationMessage('Phone is invalid, format is xxx-xxx-xxxx');
                      setMobileValid(false);
                    } else {
                      setMobileValidationMessage('');
                      setMobileValid(true);
                    }
                  }}
                  error={!mobileValid}
                  validationMessage={mobileValidationMessage} />
              </Flex>
              <Flex direction="row" align="end" gap="extra-small">
                <Input name="text" label="Alternate Number" value={alternateNumber} description="Format: xxx-xxx-xxxx"
                  onChange={(value) => {
                    var formattedNumber = handleAlternatePhoneInput(value);

                    if (!IsValidPhone(formattedNumber)) {
                      setAlternatePhoneValidationMessage('Phone is invalid, format is xxx-xxx-xxxx');
                      setAlternatePhoneValid(false);
                    } else {
                      setAlternatePhoneValidationMessage('');
                      setAlternatePhoneValid(true);
                    }
                  }}
                  error={!alternatePhoneValid}
                  validationMessage={alternatePhoneValidationMessage} />
                <Input name="text" label="Fax Number" value={faxNumber} description="Format: xxx-xxx-xxxx"
                  onChange={(value) => {
                    var formattedNumber = handleFaxPhoneInput(value);

                    if (!IsValidPhone(formattedNumber)) {
                      setFaxValidationMessage('Phone is invalid, format is xxx-xxx-xxxx');
                      setFaxValid(false);
                    } else {
                      setFaxValidationMessage('');
                      setFaxValid(true);
                    }
                  }}
                  error={!faxValid}
                  validationMessage={faxValidationMessage} />
              </Flex>
              <Flex direction="row" align="end" gap="extra-small">
                <Box flex={1}>
                  <Input name="text" label="Email" value={email}
                    onChange={(value) => {
                      setEmail(value)
                      if (!IsValidEmail(value)) {
                        setEmailValidationMessage('Email is invalid, max 30 characters.');
                        setEmailValid(false);
                      } else {
                        setEmailValidationMessage('');
                        setEmailValid(true);
                      }
                    }}
                    error={!emailValid}
                    validationMessage={emailValidationMessage} />
                </Box>
                <Select
                  options={selectDoNotUseInternetOrEmailOptions}
                  label="Do Not Use Internet Or Email"
                  name="do-not-use-internet-or-email"
                  value={doNotUseEmail}
                  onChange={(value) => { setDoNotUseEmail(value) }}
                />
              </Flex>
              <Divider></Divider>
              <Flex direction="row" align="end" gap="extra-small">
                <Box flex={1}>
                  <Select
                    options={selectTaxingProvinceOptions}
                    label="Taxing Province"
                    name="contact-taxing-province-ind"
                    value={taxingProvince}
                    required={true}
                    onChange={(value) => {
                      setTaxingProvince(value);
                      if (!value) {
                        setTaxingProvinceValidationMessage('Taxing province is required');
                        setTaxingProvinceValid(false);
                      } else {
                        setTaxingProvinceValidationMessage('');
                        setTaxingProvinceValid(true);
                      }
                    }}
                    error={!taxingProvinceValid}
                    validationMessage={taxingProvinceValidationMessage}
                  />
                </Box>
                <Input name="text" label="Last Filed Year" value={lastFiledYear}
                  description="If last filed is blank, 1915 will be used as a temporary placeholder."
                  required={true}
                  error={!lastFiledYearValid}
                  validationMessage={lastFiledYearValidationMessage}
                  onChange={(value) => { setLastFiledYear(value) }}
                  onInput={(value) => {
                    const parsedValue = parseInt(value);
                    if (value != undefined && (parsedValue < 1900 || parsedValue >= 2999 || isNaN(parsedValue))) {
                      setLastFiledYearValidationMessage('Please enter a valid year');
                      setLastFiledYearValid(false);
                    }
                    else {
                      setLastFiledYearValidationMessage('');
                      setLastFiledYearValid(true);
                    }
                  }} />
                <Input name="text" label="CRA Business Number" value={craBusinessNumber}
                  onChange={(value) => { setCRABusinessNumber(value) }}
                  error={!craBusinessNumberValid}
                  validationMessage={craBusinessNumberValidationMessage}
                  onInput={(value) => {
                    if (!IsValidSIN(value)) {
                      setCRABusinessNumberValidationMessage('Please enter a valid CRA Number');
                      setCRABusinessNumberValid(false);
                    }
                    else {
                      setCRABusinessNumberValidationMessage('');
                      setCRABusinessNumberValid(true);
                    }
                  }} />
              </Flex>
              <Divider></Divider>
              <Text format={{ fontWeight: 'bold' }}>Contact Address</Text>
              <Flex direction="row" align="end" gap="extra-small">
                <Box flex={1}>
                  <Input name="text" label="Care Of" value={careOf} onChange={(value) => { setCareOf(value.toUpperCase()) }} />
                </Box>
              </Flex>
              <Flex direction="row" align="end" gap="extra-small">
                <Input name="text" label="Apartment" value={apartment} onChange={(value) => { setApartment(value) }} />
                <Input name="text" label="Range Road" value={rangeRoad} onChange={(value) => { setRangeRoad(value) }} />
              </Flex>
              <Flex direction="row" align="baseline" gap="extra-small">
                <Box flex={1}>
                  <Input name="text" label="Street" value={street}
                    required={true}
                    onChange={(value) => { setStreet(value.toUpperCase()) }}
                    error={!streetValid}
                    validationMessage={streetValidationMessage}
                    onInput={(value) => {
                      if (!IsValidAddress(value, poBox)) {
                        setStreetValidationMessage('Street or PO Box is required');
                        setPOBoxValidationMessage('Street or PO Box is required');
                        setPOBoxValid(false);
                        setStreetValid(false);
                      } else {
                        setStreetValidationMessage('');
                        setPOBoxValidationMessage('');
                        setStreetValid(true);
                        setPOBoxValid(true);
                      }
                    }}
                  />
                </Box>
                <Text>-or-</Text>
                <Input name="text" label="PO Box" value={poBox}
                  required={true}
                  onChange={(value) => { setPOBox(value.toUpperCase()) }}
                  error={!poBoxValid}
                  validationMessage={poBoxValidationMessage}
                  onInput={(value) => {
                    if (!IsValidAddress(street, value)) {
                      setStreetValidationMessage('Street or PO Box is required');
                      setPOBoxValidationMessage('Street or PO Box is required');
                      setPOBoxValid(false);
                      setStreetValid(false);
                    } else {
                      setStreetValidationMessage('');
                      setPOBoxValidationMessage('');
                      setStreetValid(true);
                      setPOBoxValid(true);
                    }
                  }}
                />
              </Flex>
              <Flex direction="row" align="end" gap="extra-small">
                <Box flex={1}>
                  <Select
                    options={selectCountryOptions}
                    label="Country"
                    name="contact-update-country-ind"
                    value={country}
                    required={true}
                    onChange={(value) => {
                      setCountry(value);
                      if (!value) {
                        setCountryValidationMessage('Country is required');
                        setCountryValid(false);
                      } else {
                        setCountryValidationMessage('');
                        setCountryValid(true);

                        setProvince('');

                        setShowCanada(false);
                        setShowUS(false);
                        setShowRegion(false);

                        if (value == 'CA') {
                          setShowCanada(true);
                        } else if (value == 'US') {
                          setShowUS(true);
                        } else if (value == 'NA') {
                          setShowRegion(true);
                        }
                      }
                    }}
                    error={!countryValid}
                    validationMessage={countryValidationMessage}
                  />
                </Box>
                <Box flex={1}>
                  {showCanada &&
                    <Select
                      options={selectProvinceOptions}
                      label="Province"
                      required={true}
                      name="contact-update-province-ind"
                      value={province}
                      onChange={(value) => {
                        setProvince(value);
                        if (!value) {
                          setProvinceValidationMessage('Province is required');
                          setProvinceValid(false);
                        } else {
                          setProvinceValidationMessage('');
                          setProvinceValid(true);
                        }
                      }}
                      error={!provinceValid}
                      validationMessage={provinceValidationMessage}
                    />
                  }
                  {showUS &&
                    <Select
                      options={selectStateOptions}
                      label="State"
                      required={true}
                      name="contact-update-state-ind"
                      value={province}
                      onChange={(value) => {
                        setProvince(value);
                        if (!value) {
                          setProvinceValidationMessage('State is required');
                          setProvinceValid(false);
                        } else {
                          setProvinceValidationMessage('');
                          setProvinceValid(true);
                        }
                      }}
                      error={!provinceValid}
                      validationMessage={provinceValidationMessage}
                    />
                  }
                  {showRegion &&
                    <Select
                      options={selectProvinceNROptions}
                      label="Region"
                      required={true}
                      name="contact-update-nr-ind"
                      value={province}
                      onChange={(value) => {
                        setProvince(value);
                        if (!value) {
                          setProvinceValidationMessage('Region is required');
                          setProvinceValid(false);
                        } else {
                          setProvinceValidationMessage('');
                          setProvinceValid(true);
                        }
                      }}
                      error={!provinceValid}
                      validationMessage={provinceValidationMessage}
                    />
                  }
                </Box>
                <Input name="text" label="City" value={city}
                  required={true}
                  onChange={(value) => { setCity(value.toUpperCase()) }}
                  error={!cityValid}
                  validationMessage={cityValidationMessage}
                  onInput={(value) => {
                    if (value === '') {
                      setCityValidationMessage('City is required');
                      setCityValid(false);
                    } else {
                      setCityValidationMessage('');
                      setCityValid(true);
                    }
                  }} />
                <Input name="text" label="Postal / Zip Code" value={postalCode}
                  required={true}
                  onChange={(value) => { setPostalCode(value.toUpperCase()) }}
                  error={!postalCodeValid}
                  validationMessage={postalCodeValidationMessage}
                  onInput={(value) => {
                    if (value === '') {
                      setPostalCodeValidationMessage('Postal / Zip code is required');
                      setPostalCodeValid(false);
                    } else if (!IsValidPostalZipCode(country, value)) {
                      setPostalCodeValidationMessage('Postal / Zip code is invalid');
                      setPostalCodeValid(false);
                    } else {
                      setPostalCodeValidationMessage('');
                      setPostalCodeValid(true);
                    }
                  }}
                />
              </Flex>
              <Flex direction="row" align="end" gap="extra-small">
                <Input name="text" label="Loc Plan Or Range WOM" value={locPlan} onChange={(value) => { setLocPlan(value) }} />
                <Input name="text" label="Lot Quadrant" value={lotQuadrant} onChange={(value) => { setLotQuadrant(value) }} />
                <Input name="text" label="Lot Section" value={lotSection} onChange={(value) => { setLotSection(value) }} />
                <Input name="text" label="Township Concession" value={townshipConcession} onChange={(value) => { setTownshipConcession(value) }} />
              </Flex>
            </>
          }
        </Tile>
      }

      {!isLoading && isIndividual && entitySelected &&
        <Tile compact={true}>
          <Text format={{ fontWeight: 'bold' }}>Individual Tax Information</Text>
          <Flex direction="row" align="end" gap="extra-small">
            <DateInput
              label="Date Of Birth"
              name="contact-date-of-birth"
              description="Date of birth in YYYY-MM-DD format"
              format="YYYY-MM-DD"
              value={dateOfBirth}
              required={true}
              onChange={(value) => {
                setDateOfBirth(value);
                if (isIndividual && !value) {
                  setDateOfBirthValidationMessage('Date is required');
                  setDateOfBirthValid(false);
                } else {
                  setDateOfBirthValidationMessage('');
                  setDateOfBirthValid(true);
                }
              }}
              error={!dateOfBirthValid}
              validationMessage={dateOfBirthValidationMessage}
            />
            <DateInput
              label="Date Of Death"
              name="contact-date-of-death"
              description="Date of death in YYYY-MM-DD format"
              format="YYYY-MM-DD"
              value={dateOfDeath}
              required={false}
              onChange={(value) => {
                setDateOfDeath(value);

                if (isIndividual && !IsValidDateOfDeath(value, dateOfBirth)) {
                  setDateOfDeathValidationMessage('Date must be greater than date of birth');
                  setDateOfDeathValid(false);
                } else {
                  setDateOfDeathValidationMessage('');
                  setDateOfDeathValid(true);
                }
              }}
              error={!dateOfDeathValid}
              validationMessage={dateOfDeathValidationMessage}
            />
          </Flex>
          <Flex direction="row" align="end" gap="extra-small">
            <Select
              options={selectONFirstNationExemptionOptions}
              label="Ontario First Nation Sales Tax Exemption"
              name="contact-on-first-nation-exemption"
              value={onFirstNationExemption}
              onChange={(value) => { setONFirstNationExemption(value) }}
            />
            <Input name="text" label="Status Indian Registration Number" value={statusIndianRegistrationNumber}
              onChange={(value) => { setStatusIndianRegistrationNumber(value) }}
              error={!indianStatusValid}
              validationMessage={indianStatusValidationMessage}
              onInput={(value) => {
                if (value.length > 10) {
                  setIndianStatusValidationMessage('Invalid indian registration number');
                  setIndianStatusValid(false);
                } else {
                  setIndianStatusValidationMessage('');
                  setIndianStatusValid(true);
                }
              }} />
          </Flex>
          <Flex direction="row" align="end" gap="extra-small">
            <Input name="text" label="SIN Number" value={sinNumber} onChange={(value) => { setSINNumber(value) }}
              description="If SIN is blank, 999999999 will be used as a temporary placeholder."
              required={true}
              error={!sinValid}
              validationMessage={sinValidationMessage}
              onInput={(value) => {
                if (isIndividual && !IsValidSIN(value)) {
                  setSINValidationMessage('Invalid SIN');
                  setSINValid(false);
                } else {
                  setSINValidationMessage('');
                  setSINValid(true);
                }
              }}
            />
            <Select
              options={selectMaritalStatusOptions}
              label="Marital Status"
              name="contact-marital-status"
              value={maritalStatus}
              onChange={(value) => { setMaritalStatus(value) }}
            />
            <Select
              options={[
                { label: 'M', value: 'M' },
                { label: 'F', value: 'F' },
              ]}
              label="Gender"
              name="contact-gender"
              value={gender}
              onChange={(value) => { setGender(value) }}
            />
          </Flex>
        </Tile>
      }

      {!isLoading && !isIndividual && entitySelected &&
        <Tile compact={true}>
          {!isPartnership &&
            <Text format={{ fontWeight: 'bold' }}>Corporate Tax Information</Text>
          }
          {isPartnership &&
            <Text format={{ fontWeight: 'bold' }}>Partnership Tax Information</Text>
          }
          <Flex direction="row" align="end" gap="extra-small">
            {!isPartnership &&
              <>
                <Box flex={1}>
                  <DateInput
                    label="Incorporation Date"
                    description="Incorporation Date in YYYY-MM-DD format"
                    name="contact-incorporation-date"
                    format="YYYY-MM-DD"
                    required={true}
                    value={incorporationDate}
                    onChange={(value) => {
                      setIncorporationDate(value);
                      if (!isIndividual && !value) {
                        setDateOfRegistrationValidationMessage('Date is required');
                        setDateOfRegistrationValid(false);
                      } else {
                        setDateOfRegistrationValidationMessage('');
                        setDateOfRegistrationValid(true);
                      }
                    }}
                    error={!dateOfRegistrationValid}
                    validationMessage={dateOfRegistrationValidationMessage}
                  />
                </Box>
                <Box flex={1}>
                  <Select
                    options={selectProvinceOfRegistrationOptions}
                    label="Province Of Registration / Incorporation"
                    name="contact-province-registration-corp"
                    required={true}
                    value={provinceOfRegistration}
                    onChange={(value) => {
                      setProvinceOfRegistration(value);
                      if (!isIndividual && !value) {
                        setProvinceOfIncorporationValidationMessage('Province is required');
                        setProvinceOfIncorporationValid(false);
                      } else {
                        setProvinceOfIncorporationValidationMessage('');
                        setProvinceOfIncorporationValid(true);
                      }
                    }}
                    error={!provinceOfIncorporationValid}
                    validationMessage={provinceOfIncorporationValidationMessage}
                  />
                </Box>
              </>
            }
          </Flex>
          <Flex direction="row" align="end" gap="extra-small">
            <Input name="text" label="Fiscal Year End Month" value={fiscalYearEndMonth}
              error={!fiscalYearEndMonthValid}
              validationMessage={fiscalYearEndMonthValidationMessage}
              onChange={(value) => { setFiscalYearEndMonth(value) }}
              onInput={(value) => {
                const parsedValue = parseInt(value);
                if (parsedValue < 1 || parsedValue > 12 || isNaN(parsedValue)) {
                  setFiscalYearEndMonthValidationMessage('Please enter a valid month');
                  setFiscalYearEndMonthValid(false);
                } else {
                  setFiscalYearEndMonthValidationMessage('');
                  setFiscalYearEndMonthValid(true);
                }
              }} />
            <Input name="text" label="Fiscal Year End Day" value={fiscalYearEndDay}
              error={!fiscalYearEndDayValid}
              validationMessage={fiscalYearEndDayValidationMessage}
              onChange={(value) => { setFiscalYearEndDay(value) }}
              onInput={(value) => {
                const parsedValue = parseInt(value);
                if (parsedValue < 1 || parsedValue > 31 || isNaN(parsedValue)) {
                  setFiscalYearEndDayValidationMessage('Please enter a valid day');
                  setFiscalYearEndDayValid(false);
                } else {
                  setFiscalYearEndDayValidationMessage('');
                  setFiscalYearEndDayValid(true);
                }
              }} />
            <Text>* If Fiscal Year End is empty, it will default to Dec 31 until it is entered.</Text>
          </Flex>
          <Flex direction="row" align="end" gap="extra-small">
            <DateInput
              label="Start Date"
              description="Start Date in YYYY-MM-DD format"
              name="contact-start-date"
              required={true}
              format="YYYY-MM-DD"
              value={startDate}
              onChange={(value) => {
                setStartDate(value);
                if (!isIndividual && !value) {
                  setStartDateValidationMessage('Date is required');
                  setStartDateValid(false);
                } else {
                  setStartDateValidationMessage('');
                  setStartDateValid(true);
                }
              }}
              error={!startDateValid}
              validationMessage={startDateValidationMessage}
            />
            <Input name="text" label="ON Farm Business Registration Number" value={onFarmBusinessNumber}
              onChange={(value) => { setONFarmBusinessNumber(value) }}
              onInput={(value) => {
                if (value !== '' && value !== undefined && (value.length != 9)) {
                  setONFarmBusinessValidationMessage('Please enter a valid registration number (9 digits)');
                  setONFarmBusinessValid(false);
                } else {
                  setONFarmBusinessValidationMessage('');
                  setONFarmBusinessValid(true);
                }
              }}
              error={!onFarmBusinessValid}
              validationMessage={onFarmBusinessValidationMessage}
            />
            <Input name="text" label="Provincial Corporate Tax Number" value={provincialCorporateTaxNumber}
              onChange={(value) => { setProvincialCorporateTaxNumber(value) }}
              onInput={(value) => {
                if (value !== '' && value !== undefined && (value.length > 8 || value.length < 7)) {
                  setProvincialCorporateTaxNumberValidationMessage('Please enter a valid registration number (7-8 digits)');
                  setProvincialCorporateTaxNumberValid(false);
                } else {
                  setProvincialCorporateTaxNumberValidationMessage('');
                  setProvincialCorporateTaxNumberValid(true);
                }
              }}
              error={!provincialCorporateTaxNumberValid}
              validationMessage={provincialCorporateTaxNumberValidationMessage}
            />
            <Input name="text" label="PST Number" value={pstNumber}
              onChange={(value) => { setPSTNumber(value) }}
              onInput={(value) => {
                if (value !== '' && value !== undefined && (value.length > 15)) {
                  setPSTNumberValidationMessage('Please enter a valid pst number (max 15 characters)');
                  setPSTNumberValid(false);
                } else {
                  setPSTNumberValidationMessage('');
                  setPSTNumberValid(true);
                }
              }}
              error={!pstNumberValid}
              validationMessage={pstNumberValidationMessage}
            />
          </Flex>
          <Flex direction="row" align="end" gap="extra-small">
            {isPartnership &&
              <Select
                options={[
                  { label: 'Yes', value: 'true' },
                  { label: 'No', value: 'false' }
                ]}
                error={false}
                label="Is T5013 Partnership?"
                name="t5013-partnership"
                value={isT5013Partnership}
                onChange={(value) => {
                  setIsT5013Partnership(value);
                }}
              />
            }
          </Flex>
        </Tile>
      }

      {!isLoading && entitySelected &&
        <Tile compact={true}>
          <Flex direction="row" align="end" gap="extra-small">
            <LoadingButton variant='primary' loading={isPosting} onClick={handleClick}>
              Submit Update
            </LoadingButton>
          </Flex>
        </Tile>
      }
    </>
  );

  function IsValidDateOfDeath(dateOfDeath, dateOfBirth) {
    if (dateOfDeath == undefined || dateOfDeath == null
      || dateOfBirth == undefined || dateOfBirth == null) {
      return true;
    }

    const dateOfBirthDate = new Date(dateOfBirth.year, dateOfBirth.month - 1, dateOfBirth.date);
    const dateOfDeathDate = new Date(dateOfDeath.year, dateOfDeath.month - 1, dateOfDeath.date);

    if (dateOfDeathDate < dateOfBirthDate) {
      return false;
    }

    return true;
  }

  function IsValidPhone(phone) {
    phone = phone.trim();

    if (phone == undefined || phone == null) {
      return true;
    }

    if (phone.length == 0) {
      return true;
    }

    if (phone.length != 12) {
      return false;
    }

    var phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  function IsValidEmail(email) {
    email = email.trim();

    if (email === '') {
      return true;
    }

    if (email.length > 30) {
      return false;
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function IsValidLastFiledYear(year) {
    if (typeof year === 'number') {
      year = year.toString();
    }

    if (year.length === 0) {
      return true;
    }

    if (year.length === 4) {

      //placeholder year if unknown
      if (year === '1915') {
        return true;
      }

      const parsedValue = parseInt(year);
      if (year != undefined && (parsedValue < 1900 || parsedValue >= 2999 || isNaN(parsedValue))) {
        return false;
      }
      else {
        return true;
      }

    } else {
      return false;
    }
  }

  function IsValidSIN(sin) {
    var check, even, tot;

    if (sin === undefined || sin === null) {
      return true;
    }

    if (typeof sin === 'number') {
      sin = sin.toString();
    }

    if (sin.length === 0) {
      return true;
    }

    if (sin.length === 9) {

      if (sin.startsWith("******")) {
        return true;
      }

      //placeholder sin if unknown
      if (sin === '999999999') {
        return true;
      }

      // convert to an array & pop off the check digit
      sin = sin.split('');
      check = +sin.pop();

      even = sin
        // take the digits at the even indices
        .filter(function (_, i) { return i % 2; })
        // multiply them by two
        .map(function (n) { return n * 2; })
        // and split them into individual digits
        .join('').split('');

      tot = sin
        // take the digits at the odd indices
        .filter(function (_, i) { return !(i % 2); })
        // concatenate them with the transformed numbers above
        .concat(even)
        // it's currently an array of strings; we want numbers
        .map(function (n) { return +n; })
        // and take the sum
        .reduce(function (acc, cur) { return acc + cur; });

      // compare the result against the check digit
      return check === (10 - (tot % 10)) % 10;
    } else {
      return false;
    }
  }

  function IsValidPostalZipCode(country, input) {
    input = input.trim();
    var postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    var zipCodeRegex = /^\d{5}(?:[-\s]\d{4})?$/;
    var isValid = false;

    if (country == 'CA') {
      isValid = postalCodeRegex.test(input);
    } else if (country == 'US') {
      isValid = zipCodeRegex.test(input);
    } else {
      isValid = true;
    }

    return isValid;
  }

  function IsValidAddress(street, pobox) {
    var isValid = false;

    if ((street == undefined || street == null || street == '') && (pobox == undefined || pobox == null || pobox == '')) {
      isValid = false;
    } else {
      isValid = true;
    }

    return isValid;
  }

  function ResetValidation() {
    setFirstNameValid(true);
    setLastNameValid(true);
    setLastFiledYearValid(true);
    setStreetValid(true);
    setPOBoxValid(true);
    setCityValid(true);
    setCountryValid(true);
    setProvinceValid(true);
    setPostalCodeValid(true);
    setSINValid(true);
    setTaxingProvinceValid(true);
    setProvinceOfIncorporationValid(true);
    setDateOfRegistrationValid(true);
    setEmailValid(true);
    setStartDateValid(true);
    setCRABusinessNumberValid(true);
    setFiscalYearEndDayValid(true);
    setFiscalYearEndMonthValid(true);
    setLegalNameValid(true);
    setPhoneValid(true);
    setAlternatePhoneValid(true);
    setFaxValid(true);
    setMobileValid(true);
    setDateOfBirthValid(true);
    setDateOfDeathValid(true);
    setONFarmBusinessValid(true);
    setProvincialCorporateTaxNumberValid(true);
    setPSTNumberValid(true);
    setIndianStatusValid(true);
  }

  function ExtractDateFromDateString(dateString) {
    if (dateString === null || dateString === undefined) {
      return undefined;
    }

    var parts = dateString.split('-');
    const dateObj = { year: parseInt(parts[0]), month: parseInt(parts[1] - 1), date: parseInt(parts[2]) };

    return dateObj;
  }

  function SubmissionValidation() {
    var invalidFields = '';

    if (isIndividual && (firstName == undefined || firstName == '')) {
      invalidFields += 'First Name, ';
      setFirstNameValid(false);
    }

    if (isIndividual && (lastName == undefined || lastName == '')) {
      invalidFields += 'Last Name, ';
      setLastNameValid(false);
    }

    if (!IsValidLastFiledYear(lastFiledYear)) {
      invalidFields += 'Last Filed Year, ';
      setLastFiledYearValid(false);
    }

    if (!IsValidAddress(street, poBox)) {
      invalidFields += 'Street or POBox, ';
      setStreetValid(false);
      setPOBoxValid(false);
    }

    if (city == undefined || city == '') {
      invalidFields += 'City, ';
      setCityValid(false);
    }

    if (postalCode == undefined || postalCode == '') {
      invalidFields += 'Postal Code, ';
      setPostalCodeValid(false);
    }

    if (isIndividual && !IsValidSIN(sinNumber)) {
      invalidFields += 'SIN, ';
      setSINValid(false);
    }

    if (!isIndividual && (legalName == undefined || legalName == '')) {
      invalidFields += 'Legal Name, ';
      setLegalNameValid(false);
    }

    if (taxingProvince == undefined || taxingProvince == '') {
      invalidFields += 'Taxing Province, ';
      setTaxingProvinceValid(false);
    }

    if (country == undefined || country == '') {
      invalidFields += 'Country, ';
      setCountryValid(false);
    }

    if (province == undefined || province == '') {
      invalidFields += 'Province, ';
      setProvinceValid(false);
    }

    if (!phoneValid) {
      invalidFields += 'Phone, ';
    }

    if (!mobileValid) {
      invalidFields += 'Mobile, ';
    }

    if (!faxValid) {
      invalidFields += 'Fax, ';
    }

    if (!alternatePhoneValid) {
      invalidFields += 'Alternate Phone, ';
    }

    if (!indianStatusValid) {
      invalidFields += 'Indian Status Number, ';
    }

    if (!isIndividual && !onFarmBusinessValid) {
      invalidFields += 'Ontario Farm Business Number, ';
      setONFarmBusinessValid(false);
    }

    if (!isIndividual && !pstNumberValid) {
      invalidFields += 'PST Number, ';
      setPSTNumberValid(false);
    }

    if (!isIndividual && !provincialCorporateTaxNumberValid) {
      invalidFields += 'Provincial Corporate Tax Number, ';
      setProvincialCorporateTaxNumberValid(false);
    }

    if (!isIndividual && !isPartnership && (incorporationDate == undefined || incorporationDate == '')) {
      invalidFields += 'Incorporation Date, ';
      setDateOfRegistrationValid(false);
    }

    if (!isIndividual && !isPartnership && (provinceOfRegistration == undefined || provinceOfRegistration == '')) {
      invalidFields += 'Province of Registration, ';
      setProvinceOfIncorporationValid(false);
    }

    if (!isIndividual && (startDate == undefined || startDate == '')) {
      invalidFields += 'Start Date, ';
      setStartDateValid(false);
    }

    if (isIndividual && (dateOfBirth == undefined || dateOfBirth == '')) {
      invalidFields += 'Date of Birth, ';
      setDateOfBirthValid(false);
    }

    if (isIndividual && !IsValidDateOfDeath(dateOfDeath, dateOfBirth)) {
      invalidFields += 'Date of Death, ';
      setDateOfDeathValid(false);
    }

    return invalidFields;
  }

  function formatPhoneNumber(value) {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
};

