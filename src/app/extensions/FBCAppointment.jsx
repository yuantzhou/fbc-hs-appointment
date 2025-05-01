import React, { useEffect, useState, useRef } from "react";

import "./Appointment.css";
import {
  Button,
  Text,
  Input,
  Flex,
  hubspot,
  Dropdown,
  Heading,
  NumberInput,
  DateInput,
  Tile,
  Form,
  addAlert,
  Select,
  LoadingSpinner,
  Divider,
  List,
  ButtonRow,
  Box,
  TextArea, Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,

} from "@hubspot/ui-extensions";
import { CrmActionButton } from '@hubspot/ui-extensions/crm';
import { setDefaultLocale } from "react-datepicker";


// Define the extension to be run within the Hubspot CRM
hubspot.extend(({ context, runServerlessFunction, actions }) => (
  <Extension
    context={context}
    runServerless={runServerlessFunction}
    sendAlert={actions}
    actions={actions}
    openIframe={actions.openIframeModal}

  />
));


// Define the Extension component, taking in runServerless, context, & sendAlert as props
const Extension = ({ context, runServerless, sendAlert, actions, openIframe }) => {
  const {
    fetchCrmObjectProperties,
    onCrmPropertiesUpdate,
    refreshObjectProperties,
  } = actions;
  //console.log(context)
  const inputRef = useRef();
  //const [properties, setProperties] = useState<Record<string, string>> ({});
  const [accountId, setAccountId] = useState(context.crm.objectId);
  const [selectedContact, setSelectedContact] = useState({});
  const [primaryContact, setPrimaryContact] = useState({});
  const [selectContactOptions, setSelectContactOptions] = useState([]);
  const [appointmentType, setAppointmentType] = useState([]);
  const [selectedAppointmentType, setselectedAppointmentType] = useState();
  const [appointmentSubType, setAppointmentSubType] = useState();
  const [selectedsubAppointmentType, setselectedsubAppointmentType] = useState();
  const [AllSubAppointmentType, setAllSubAppointmentType] = useState();
  const [MeetingLoction, setMeetingLocation] = useState([]);
  const [TaxYear, setTaxYear] = useState();

  const [PreferredMeetingLocation, setPreferredMeetingLocation] = useState([{ option: "Virtual", value: "Virtual" }, { option: "In Person", value: "In Person" }, { option: "Phone Call", value: "Phone Call" }, { option: "Custom", value: "Custom" }]);
  const [Hosts, setHosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState({ formattedDate: new Date().toISOString().substring(0, 10) });
  const [selectedHost, setSelectedHost] = useState(context.user.firstName + " " + context.user.lastName);
  const [allAvailabilities, setAllAvailability] = useState();
  const [bookingUserInfo, setBookingUserInfo] = useState();
  const [formattedYear, setFormattedYear] = useState();
  const [defaultSlug, setDefaultSlug] = useState();
  const [TimeZone, setTimeZone] = useState();
  const [MeetingType, setMeetingType] = useState();
  const [MeetingAddress, setMeetingAddress] = useState("Meeting At ");
  const [PhoneNumber, setPhoneNumber] = useState();
  const [MeetingDescription, setMeetingDescription] = useState()
  const [TimeZoneOptions, setTimeZoneOptions] = useState([
    {
      label: '(UTC-08:00) Pacific Time - Vancouver',
      onClick: () => setTimeZone('(UTC-08:00)')
    },
    {
      label: '(UTC-07:00) Mountain Time - Edmonton',
      onClick: () => setTimeZone('(UTC-07:00)')
    },
    {
      label: '(UTC-06:00) Central Time - Winnipeg',
      onClick: () => setTimeZone('(UTC-06:00)')
    },
    {
      label: '(UTC-05:00) Eastern Time - Toronto',
      onClick: () => setTimeZone('(UTC-05:00)')
    },
    {
      label: '(UTC-04:00) Atlantic Time - Halifax',
      onClick: () => setTimeZone('(UTC-04:00)')
    },
    {
      label: "(UTC-03:30) Newfoundland Time - St. John's",
      onClick: () => setTimeZone('(UTC-03:30)')
    },
    {
      label: '(UTC-07:00) Mountain Time - Yellowknife',
      onClick: () => setTimeZone('(UTC-07:00)')
    },
    {
      label: '(UTC-06:00) Central Time - Regina (no DST)',
      onClick: () => setTimeZone('(UTC-06:00)')
    },
    {
      label: '(UTC-05:00) Eastern Time - Iqaluit',
      onClick: () => setTimeZone('(UTC-05:00)')
    },
    {
      label: '(UTC-05:00) Eastern Time - Montreal',
      onClick: () => setTimeZone('(UTC-05:00)')
    }
  ]
  )
  //current availiablity array
  const [availability, setAvailability] = useState();
  const [working, setWorking] = useState(true);
  const [defaultDate, setDefaultDate] = useState({ year: new Date().getFullYear(), month: new Date().getMonth(), date: new Date().getDate() });
  //all Durations
  const [Duration, setDuration] = useState();
  //current Duration
  const [cDuration, setCDuration] = useState("");
  const [pickedTime, setPickedTime] = useState();
  //validationMessage 
  const [yearValidationMessage, setYearValidationMessage] = useState('');
  const [yearIsValid, setYearIsValid] = useState(true);
  const [HostValidationMessage, setHostValidationMessage] = useState('');
  const [HostIsValid, setHostIsValid] = useState(true);

  //get AssociatedContacts
  useEffect(async () => {
    console.log(context)
    await runServerless({ name: 'getAssociatedContacts', parameters: { objectId: accountId } }).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          console.log(serverlessResponse)
          let PContact = serverlessResponse.response.find((element) => element.type == "fbc_primary_contact")
          // [{label:contactCall.properties.firstname,value:contactCall.properties.firstname, type:contact.type, contactId:contact.id}]
          // change in getAssociatedContacts.js for more properties
          if (PContact) {
            PContact.label = PContact.label + " (Primary Contact)"
            setPrimaryContact(PContact)
            setSelectedContact(PContact)
            let CleanOptions = serverlessResponse.response.filter((element) => element.type == "contact_to_fbc_accounts" && element.value != PContact.value)
            CleanOptions.push(PContact)
            setSelectContactOptions(CleanOptions);
          } else {
            let CleanOptions = serverlessResponse.response.filter((element) => element.type == "contact_to_fbc_accounts")
            setSelectContactOptions(CleanOptions);
          }



        }
      }
    );

  }, []);

  //get information from hubDB
  useEffect(() => {
    runServerless({ name: 'getHubDB' ,parameters: { Tables:["meeting_types","meeting_sub_types"] }}).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          console.log(serverlessResponse.response)
          let MeetingTypes=[]
          let SubMeetingTypes=[]
          for (let table of serverlessResponse.response){
            if(table.TableName== "meeting_types")
            {
              for(let row of table.Rows ){
                MeetingTypes.push({value:row.values.meeting_type_code.label, label:row.values.meeting_type_code.label})
              }
            }
            if(table.TableName== "meeting_sub_types")
              {
                for(let row of table.Rows ){
                  SubMeetingTypes.push({MainMeetingType:row.values.meeting_type_code.label,SubMeetingType:row.values.meeting_sub_type, value:row.values.meeting_sub_type, label:row.values.meeting_sub_type})
                }
              }
          }
          console.log(MeetingTypes)
          setAppointmentType(MeetingTypes)
          console.log(SubMeetingTypes)
          setAllSubAppointmentType(SubMeetingTypes)
          }
           
          
        }
      
    );
  }, []);
  //get Users 
  useEffect(async () => {
    await runServerless({ name: 'getUsers' }).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          let HostsObjectArray = serverlessResponse.response
          HostsObjectArray.map(obj => (obj.label = obj.properties.hs_searchable_calculated_name, obj.value = obj.properties.hs_searchable_calculated_name))
          console.log(HostsObjectArray)
          setHosts(HostsObjectArray)
          console.log(selectedHost)
          setSelectedHost(HostsObjectArray.find(obj => obj.label == selectedHost))
          setTimeZone(HostsObjectArray.find(obj => obj.label == selectedHost).properties.hs_standard_time_zone)
        }
      }
    );

  }, []);
  //get User and calendar availability use today's date as default range of avaliablity 
  //default parameters
  useEffect(async () => {
    await runServerless({ name: 'getUserInformation', parameters: { context: context } }).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          console.log(serverlessResponse.response.response)
          let response = serverlessResponse.response.response
          let slug = serverlessResponse.response.slug
          console.log(slug)
          setDefaultSlug(slug)
          if (response.linkAvailability["10800000"]) {
            console.log("there a three hour default")
            let ThreeHourAva = response.linkAvailability.linkAvailabilityByDuration["10800000"].availabilities
            ThreeHourAva.map(obj => (obj.value = obj.startMillisUtc, obj.label = new Date(obj.startMillisUtc).toString()))
            setAllAvailability(response.linkAvailability.linkAvailabilityByDuration)
            console.log(ThreeHourAva)
            setAvailability(ThreeHourAva.filter(obj => new Date(obj.startMillisUtc).toISOString().substring(0, 10) == selectedDate.formattedDate))
            let Durations = Object.keys(response.linkAvailability.linkAvailabilityByDuration)
            let DurationsObjectArray = Durations.map(obj => ({ value: obj, label: obj / 60000 }))
            setDuration(DurationsObjectArray)
            setCDuration(DurationsObjectArray[0].value)
            
            setBookingUserInfo({ likelyAvailableUserIds: [response.allUsersBusyTimes[0].meetingsUser.id.toString()], slug: slug })
          } else {
            console.log("please have a 3 hour default")
            let Durations = Object.keys(response.linkAvailability.linkAvailabilityByDuration)
            let DurationsObjectArray = Durations.map(obj => ({ value: obj, label: obj / 60000 }))
            setBookingUserInfo({ likelyAvailableUserIds: [response.allUsersBusyTimes[0].meetingsUser.id.toString()], slug: slug })
            setDuration(DurationsObjectArray)
            setCDuration(DurationsObjectArray[0].value)
            
            setAllAvailability(response.linkAvailability.linkAvailabilityByDuration)
            let availabilitiesObjectArray = response.linkAvailability.linkAvailabilityByDuration[Durations[0]].availabilities
            availabilitiesObjectArray.map(obj => (obj.value = obj.startMillisUtc, obj.label = new Date(obj.startMillisUtc).toString()))
            setAvailability(availabilitiesObjectArray
              .filter(obj => new Date(obj.startMillisUtc).getFullYear() === new Date().getFullYear() && new Date(obj.startMillisUtc).getMonth() === new Date().getMonth() && new Date(obj.startMillisUtc).getDate() === new Date().getDate()))

          }


        }
      })
    console.log(selectedDate)
  }, []);
  //on Date change
  const convertMinsToHrsMins = (mins) => {
    const hours = Math.floor(mins / 60);
    const remainingMinutes = mins % 60;

    const hoursText = `${hours} hours`;
    const minutesText = `${remainingMinutes} minutes`;

    if (hours > 0 && remainingMinutes > 0) {
      return `${hours} h ${remainingMinutes} min `;
    } else if (hours > 0) {
      return hoursText;
    } else {
      return minutesText;
    }
  }
  const setDate = async (date) => {
    if(date){
    console.log(date)
    
    console.log("check if cDuration" +cDuration)
    setPickedTime()
    if (!date) {
      setAvailability()
    } else {
      setSelectedDate(date)
      // console.log(date.month-new Date().getMonth())
      // console.log(selectedHost)
      // console.log(`${date.year}-${date.month+1}-${date.date}`)

      let availabilitiesObjectArray
      if (selectedHost == context.user.firstName + " " + context.user.lastName) {
        await runServerless({ name: 'getUserInformation', parameters: { context: context, monthOffset: date.month - new Date().getMonth() } }).then(
          (serverlessResponse) => {
            if (serverlessResponse.status == 'SUCCESS') {
              setAllAvailability(serverlessResponse.response.response.linkAvailability.linkAvailabilityByDuration)
              
              if (cDuration) {
                console.log("yes cDuration")
                
                availabilitiesObjectArray = serverlessResponse.response.response.linkAvailability.linkAvailabilityByDuration[cDuration].availabilities
                availabilitiesObjectArray.map(obj => (obj.value = obj.startMillisUtc, obj.label = new Date(obj.startMillisUtc).toString()))
                console.log(availabilitiesObjectArray)
                if (selectedDate.formattedDate == new Date().toISOString().substring(0, 10)) {
                  console.log("yes cDuration")
                  setAvailability(availabilitiesObjectArray
                    .filter(obj => new Date(obj.startMillisUtc).getFullYear() === new Date().getFullYear() && new Date(obj.startMillisUtc).getMonth() === new Date().getMonth() && new Date(obj.startMillisUtc).getDate() === new Date().getDate()))
                } else {
                  console.log(availabilitiesObjectArray)
                  setAvailability(availabilitiesObjectArray
                    .filter(obj => new Date(obj.startMillisUtc).getFullYear() === selectedDate.year && new Date(obj.startMillisUtc).getMonth() === selectedDate.month && new Date(obj.startMillisUtc).getDate() === selectedDate.date))
                }
              } else {
                let availabilitiesObjectArray = []
                let durations = Object.keys(allAvailabilities)
                console.log(allAvailabilities)
                for (let Duration of durations) {
                  let ObjectArray = allAvailabilities[Duration].availabilities
                  ObjectArray.map(obj => (obj.value = obj.startMillisUtc, obj.label = new Date(obj.startMillisUtc).toString()))
                  availabilitiesObjectArray.push(...ObjectArray)
                }
                if (selectedDate.formattedDate == new Date().toISOString().substring(0, 10)) {
                 
                  setAvailability(availabilitiesObjectArray
                    .filter(obj => new Date(obj.startMillisUtc).getFullYear() === new Date().getFullYear() && new Date(obj.startMillisUtc).getMonth() === new Date().getMonth() && new Date(obj.startMillisUtc).getDate() === new Date().getDate()))
                } else {

                  setAvailability(availabilitiesObjectArray
                    .filter(obj => new Date(obj.startMillisUtc).getFullYear() === selectedDate.year && new Date(obj.startMillisUtc).getMonth() === selectedDate.month && new Date(obj.startMillisUtc).getDate() === selectedDate.date))
                }
              }

            }
          }
        )
      }
      else {
        let rightObject = Hosts.find((element) => element.value == selectedHost.label)
        setSelectedHost(rightObject)
        //console.log(selectedHost)

        await runServerless({ name: 'getUserInformation', parameters: { context: context, monthOffset: date.month - new Date().getMonth(), Host: rightObject } }).then(
          (serverlessResponse) => {
            if (serverlessResponse.status == 'SUCCESS') {
              setAllAvailability(serverlessResponse.response.response.linkAvailability.linkAvailabilityByDuration)

              console.log(cDuration)
              if (cDuration) {
                let availabilitiesObjectArray = allAvailabilities[cDuration].availabilities
                availabilitiesObjectArray.map(obj => (obj.value = obj.startMillisUtc, obj.label = new Date(obj.startMillisUtc).toString()))

                setAvailability(availabilitiesObjectArray
                  .filter(obj => new Date(obj.startMillisUtc).getFullYear() === date.year && new Date(obj.startMillisUtc).getMonth() === date.month && new Date(obj.startMillisUtc).getDate() === date.date))
                console.log(availabilitiesObjectArray
                  .filter(obj => new Date(obj.startMillisUtc).getFullYear() === date.year && new Date(obj.startMillisUtc).getMonth() === date.month && new Date(obj.startMillisUtc).getDate() === date.date))
              } else {
                let availabilitiesObjectArray = []
                let durations = Object.keys(allAvailabilities)
                for (let Duration of durations) {
                  let ObjectArray = allAvailabilities[Duration].availabilities
                  ObjectArray.map(obj => (obj.value = obj.startMillisUtc, obj.label = new Date(obj.startMillisUtc).toString()))
                  availabilitiesObjectArray.push(...ObjectArray)
                }
                setAvailability(availabilitiesObjectArray
                  .filter(obj => new Date(obj.startMillisUtc).getFullYear() === date.year && new Date(obj.startMillisUtc).getMonth() === date.month && new Date(obj.startMillisUtc).getDate() === date.date))
                console.log(availabilitiesObjectArray
                  .filter(obj => new Date(obj.startMillisUtc).getFullYear() === date.year && new Date(obj.startMillisUtc).getMonth() === date.month && new Date(obj.startMillisUtc).getDate() === date.date))
              }

            }
          }
        )
      }
      if (allAvailabilities[cDuration]) {
        let rightObject = Hosts.find((element) => element.value == selectedHost.label)
        setSelectedHost(rightObject)
        await runServerless({ name: 'getUserInformation', parameters: { context: context, monthOffset: date.month - new Date().getMonth(), Host: rightObject } }).then(
          (serverlessResponse) => {
            setAllAvailability(serverlessResponse.response.response.linkAvailability.linkAvailabilityByDuration)
        console.log(allAvailabilities)
        let availabilitiesObjectArray= serverlessResponse.response.response.linkAvailability.linkAvailabilityByDuration[cDuration].availabilities
        console.log(availabilitiesObjectArray)
        availabilitiesObjectArray.map(obj => (obj.value = obj.startMillisUtc, obj.label = new Date(obj.startMillisUtc).toString()))

        setAvailability(availabilitiesObjectArray
          .filter(obj => new Date(obj.startMillisUtc).getFullYear() === date.year && new Date(obj.startMillisUtc).getMonth() === date.month && new Date(obj.startMillisUtc).getDate() === date.date))
        console.log(availabilitiesObjectArray
          .filter(obj => new Date(obj.startMillisUtc).getFullYear() === date.year && new Date(obj.startMillisUtc).getMonth() === date.month && new Date(obj.startMillisUtc).getDate() === date.date))
        })
        } else {
        let availabilitiesObjectArray = []
        await runServerless({ name: 'getUserInformation', parameters: { context: context, monthOffset: date.month - new Date().getMonth(), Host: rightObject } }).then(
          (serverlessResponse) => {
            setAllAvailability(serverlessResponse.response.response.linkAvailability.linkAvailabilityByDuration)
        let durations = Object.keys(allAvailabilities)
        for (let Duration of durations) {
          let ObjectArray = serverlessResponse.response.response.linkAvailability.linkAvailabilityByDuration[Duration].availabilities
          ObjectArray.map(obj => (obj.value = obj.startMillisUtc, obj.label = new Date(obj.startMillisUtc).toString()))
          availabilitiesObjectArray.push(...ObjectArray)
        }
        availabilitiesObjectArray.map(obj => (obj.value = obj.startMillisUtc, obj.label = new Date(obj.startMillisUtc).toString()))

        setAvailability(availabilitiesObjectArray
          .filter(obj => new Date(obj.startMillisUtc).getFullYear() === date.year && new Date(obj.startMillisUtc).getMonth() === date.month && new Date(obj.startMillisUtc).getDate() === date.date))

        console.log(availabilitiesObjectArray
          .filter(obj => new Date(obj.startMillisUtc).getFullYear() === date.year && new Date(obj.startMillisUtc).getMonth() === date.month && new Date(obj.startMillisUtc).getDate() === date.date))
        })
        }
      
    }}else{
      console.log("no date selected!")
    }
  };
  //on Duration Change
  const changeDuration = (duration, e) => {
    setCDuration(duration)
    console.log(e.target)
    let availabilitiesObjectArray = allAvailabilities[duration].availabilities
    availabilitiesObjectArray.map(obj => (obj.value = obj.startMillisUtc, obj.label = new Date(obj.startMillisUtc).toString()))
    console.log(availabilitiesObjectArray)
    if (selectedDate.formattedDate == new Date().toISOString().substring(0, 10)) {
      console.log("correct log")
      setAvailability(availabilitiesObjectArray
        .filter(obj => new Date(obj.startMillisUtc).getFullYear() === new Date().getFullYear() && new Date(obj.startMillisUtc).getMonth() === new Date().getMonth() && new Date(obj.startMillisUtc).getDate() === new Date().getDate()))
      console.log(availabilitiesObjectArray
        .filter(obj => new Date(obj.startMillisUtc).getFullYear() === new Date().getFullYear() && new Date(obj.startMillisUtc).getMonth() === new Date().getMonth() && new Date(obj.startMillisUtc).getDate() === new Date().getDate()))
    } else {

      setAvailability(availabilitiesObjectArray
        .filter(obj => new Date(obj.startMillisUtc).getFullYear() === selectedDate.year && new Date(obj.startMillisUtc).getMonth() === selectedDate.month && new Date(obj.startMillisUtc).getDate() === selectedDate.date))
    }
  };
  const handleSelectedContact = (contactName) => {
    console.log(selectContactOptions)
    let rightObject = selectContactOptions.find((element) => element.value == contactName)
    setSelectedContact(rightObject)
    console.log(selectedContact)
    setMeetingAddress(`Meeting Address: ${rightObject.address}`)
    setPhoneNumber(`Contact Number:  ${rightObject.phone}`)
    // setBookingInformation({likelyAvailableUserIds:[selectedHost.allUsersBusyTimes[0].meetingsUser.id.toString()],
    //   legalConsentResponses: [{communicationTypeId: '302269988', consented: true}],
    //   duration:cDuration, startTime: pickedTime, timezone:Hosts.find(obj=>obj.label==selectedHost).properties.hs_standard_time_zone, 
    //   firstName:selectedContact.firstname, lastName: selectedContact.lastname })
  }

  const handleSelectedHost = (Host) => {
    let rightObject = Hosts.find((element) => element.value == Host)
    setSelectedHost(rightObject)
    console.log(rightObject)
    if (rightObject.properties.hs_standard_time_zone) {
      setTimeZone(rightObject.properties.hs_standard_time_zone)
    } else {
      setTimeZone("This Host Doesn't a Time Zone Configured")
    }

    runServerless({ name: 'getUserInformation', parameters: { context: context, Host: rightObject } }).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          let response = serverlessResponse.response.response
          let slug = serverlessResponse.response.slug
          // current slug = default meeting
          rightObject.slug = slug
          console.log(serverlessResponse.response)
          if (serverlessResponse.response == "calendar not connected") {
            setHostIsValid(false)
            setHostValidationMessage('This User have not set up their calendar');
            setAvailability()
            setAllAvailability()
            setDuration()
          } else {
            setHostIsValid(true)
            setHostValidationMessage('');
            setBookingUserInfo({ likelyAvailableUserIds: [response.allUsersBusyTimes[0].meetingsUser.id.toString()], slug: slug })
            let Durations = Object.keys(response.linkAvailability.linkAvailabilityByDuration)
            let DurationsObjectArray = Durations.map(obj => ({ value: obj, label: obj / 60000 }))
            setAllAvailability()
            setAvailability()
            setAllAvailability(response.linkAvailability.linkAvailabilityByDuration)
            setDuration(DurationsObjectArray)

            if (selectedDate.formattedDate == new Date().toISOString().substring(0, 10)) {
              console.log("correct log")
              let availabilitiesObjectArray = serverlessResponse.response.response.linkAvailability.linkAvailabilityByDuration[cDuration].availabilities
              availabilitiesObjectArray.map(obj => (obj.value = obj.startMillisUtc, obj.label = new Date(obj.startMillisUtc).toString()))
              setAvailability(availabilitiesObjectArray
                .filter(obj => new Date(obj.startMillisUtc).getFullYear() === new Date().getFullYear() && new Date(obj.startMillisUtc).getMonth() === new Date().getMonth() && new Date(obj.startMillisUtc).getDate() === new Date().getDate()))
            } else {
              let availabilitiesObjectArray = serverlessResponse.response.response.linkAvailability.linkAvailabilityByDuration[cDuration].availabilities
              availabilitiesObjectArray.map(obj => (obj.value = obj.startMillisUtc, obj.label = new Date(obj.startMillisUtc).toString()))
              setAvailability(availabilitiesObjectArray
                .filter(obj => new Date(obj.startMillisUtc).getFullYear() === selectedDate.year && new Date(obj.startMillisUtc).getMonth() === selectedDate.month && new Date(obj.startMillisUtc).getDate() === selectedDate.date))
            }
          }


          // subject:"T1 meeting",
          //   duration: 900000,
          //   firstName: 'Yuan',
          //   lastName: 'zhou',
          //   likelyAvailableUserIds: ['5591830'],
          //   legalConsentResponses: [{communicationTypeId: '302269988', consented: true}],
          //   startTime: '1737405000000',
          //   formFields: [{name: 'qwdqw', value: 'something'}],
          //   slug: 'yzhou1',
          //   email: 'yzhou@fbc.ca',
          //   timezone: 'America/Edmonton',
          //   locale: 'string'

        }
      })
  }
  const handleAvailability = (TimeOption) => {

    setPickedTime(TimeOption)
    console.log(TimeOption)
    // let test =availability.find((obj) => obj.value==TimeOption )
    // console.log(test)
    // if(availability.find((obj) => obj.value!=TimeOption )){
    //   console.log("can't find time")
    // }
  }
  const SubmitButton = () => {
    if (working) {
      return <Button type="submit" onClick={() => {
        console.log(`Someone clicked the button!${working}`);
        setWorking(!working)
      }}>Create an Appointment </Button>
    } else {
      return <LoadingSpinner label="Loading..." />
    }
  }
  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  const renderDurationList = () => {
    if (Duration) {
      let Durationjsx = []
      if (cDuration) {
        for (let duration of Duration) {
          if (duration.value == cDuration) {
            Durationjsx.push(<TableCell width={1}><Box flex={1} ><Button class="duration" variant="primary" onClick={(event) => { changeDuration(duration.value, event) }}>{convertMinsToHrsMins(duration.label)}
            </Button></Box></TableCell>)
          } else {
            Durationjsx.push(<TableCell width={1}><Box flex={1} ><Button class="duration" onClick={(event) => { changeDuration(duration.value, event) }}>{convertMinsToHrsMins(duration.label)}
            </Button></Box></TableCell>)
          }
        }

      } else {
        Durationjsx = Duration.map(obj => <TableCell width={1}><Box flex={1} > <Button class="duration" onClick={(event) => { changeDuration(obj.value, event) }}>{convertMinsToHrsMins(obj.label)}
        </Button></Box></TableCell>)
      }
      let RowInsert = createRows(Durationjsx, 4)
      RowInsert.map(array => array.splice(0, 0, <TableRow></TableRow>))
      return RowInsert

    } else {
      return
    }
  }

  const renderLocation = () => {
    let Meetingtitle = `${selectedAppointmentType}-${selectedsubAppointmentType} with ${selectedContact.firstname} ${selectedContact.lastname}`

    if (MeetingLoction) {
      if (MeetingLoction == "Virtual") {
        console.log(selectedContact)

        return <Tile>
          <Input label="Meeting Title"
            name="Meeting Title" value={Meetingtitle}></Input>

          <TextArea label="Meeting Desciption"
            name="MeetingDesciption" onBlur={e => setMeetingDescription(`${e}`)} placeholder="Message for our Member to see" value=""></TextArea>
        </Tile>
      }
      else if (MeetingLoction == "In Person") {
        
        return <Tile>
          <Input label="Meeting Title"
            name="Meeting Title" value={Meetingtitle}></Input>
          <TextArea label="Meeting Desciption"
            name="MeetingDesciption" onBlur={e => setMeetingDescription(`${e}`)} value="" placeholder="Message for our Member to see"></TextArea>
          <Input label="Meeting Address"
            name="MeetingAddress" value={selectedContact.address} onBlur={e => setMeetingAddress(`Meeting Address: ${e}`)} placeholder="Member's Address by default"></Input>
        </Tile>
      }
      else if (MeetingLoction == "Phone Call") {
        // setPhoneNumber(`Call At: ${selectedContact.phone}`)
        return <Tile>
          <Input label="Meeting Title"
            name="Meeting Title" value={Meetingtitle}></Input>
          <Input label="Meeting Type"
            name="MeetingType" value="Phone Call"></Input>
          <TextArea onBlur={e => setMeetingDescription(`${e}`)} label="Meeting Desciption"
            name="MeetingDesciption" value="" placeholder="Message for our Member to see"></TextArea>
          <Input label="Phone Number"
            name="PhoneNumber" value={selectedContact.phone} onBlur={e => setPhoneNumber(`Contact Number: ${e}`)} placeholder="Member's Contact Number"></Input>
        </Tile>
      }
      else if (MeetingLoction == "Custom") {
        return <Tile>
          <Input label="Meeting Title"
            name="Meeting Title" value={Meetingtitle}></Input>

          <TextArea label="Meeting Desciption"
            name="MeetingDesciption" value="" onBlur={e => setMeetingDescription(`${e}`)} placeholder="Message for our Member to see"></TextArea>
        </Tile>
      }
    }
  }
  function createRows(array, elementsPerRow) {
    const result = [];
    for (let i = 0; i < array.length; i += elementsPerRow) {
      result.push(array.slice(i, i + elementsPerRow));
    }
    return result;
  }




  const renderAvailableTime = () => {
    if (availability) {
      // return availability.map(obj=> <Button onClick={()=>{handleAvailability(obj.value)}}>{formatAMPM(new Date(obj.label))}
      //    </Button>)
      let avajsx = []
      if (pickedTime) {
        for (let ava of availability) {
          if (ava.value == pickedTime) {
            avajsx.push(<TableCell><Box flex={1} alignSelf="stretch"><Button class="duration" variant="primary" onClick={() => { handleAvailability(ava.value) }}>{formatAMPM(new Date(ava.label))}
            </Button></Box></TableCell>)
          } else {
            avajsx.push(<TableCell><Box flex={1} alignSelf="stretch"><Button class="duration" variant="transparent" onClick={() => { handleAvailability(ava.value) }}>{formatAMPM(new Date(ava.label))}
            </Button></Box></TableCell>)
          }
        }

      } else {
        avajsx = availability.map(obj => <TableCell> <Box flex={1} alignSelf="stretch"><Button class="duration" variant="transparent" onClick={() => { handleAvailability(obj.value) }}>{formatAMPM(new Date(obj.label))}
        </Button></Box></TableCell>)
      }
      let RowInsert = createRows(avajsx, 5)
      RowInsert.map(array => array.splice(0, 0, <TableRow></TableRow>))
      return RowInsert
    } else {
      return
    }
  }
  // const openMeetingLinkInterface = () => {
  //   console.log(selectedHost)
  //   console.log(defaultSlug)
  //   if (selectedHost == context.user.firstName + " " + context.user.lastName) {
  //     openIframe({
  //       uri: `https://fbcmm2v3-test.azurewebsites.net/AppointmentsV2Page/rtse`, // this is a relative link. Some links will be blocked since they don't allow iframing
  //       height: 1000,
  //       width: 1000,
  //       title: 'Meeting Interface',
  //       flush: true,

  //     }, () => console.log('This message will display upon closing the modal.')
  //     );
  //   }
  //   else {
  //     openIframe({
  //       uri: `https://fbcmm2v3-test.azurewebsites.net/AppointmentsV2Page/rtse`, // this is a relative link. Some links will be blocked since they don't allow iframing
  //       height: 1000,
  //       width: 1000,
  //       title: 'Meeting Interface',
  //       flush: true,

  //     }, () => console.log('This message will display upon closing the modal.')
  //     );
  //   }

  // };

  const handleTypeSelection = (e) => {
    setselectedsubAppointmentType()
    setselectedAppointmentType(e)
    setAppointmentSubType(AllSubAppointmentType.filter(obj=> obj.MainMeetingType==e))
  }
  return (
    <>
      {/* <Tabs defaultSelected="first">
    <Tab tabId="first" title="First Tab"></Tab>
    </Tabs> */}
      <Tile compact={true}>
        <Flex direction="column" gap="extra-small">
          <Heading>
            Book an Appointment With A Contact of The Account
          </Heading>
          <Text variant="microcopy">
            Use this form to create an Appointment for the the corresponding contact
          </Text>
          <Text>Select a contact you want to book an appointment with</Text>
          <Select
            value={primaryContact}
            onChange={(e) => handleSelectedContact(e)}
            options={selectContactOptions}
            variant="primary"
            buttonSize="md"
            buttonText="More"
            description="Default to Primary Contact"
          ></Select>

        </Flex>
      </Tile>

      <Tile compact={true}>
        <Text format={{ fontWeight: 'bold' }}>Appointment Information</Text>

        <Form onSubmit={async (e) => {
          // 2d array index 0 is the property name and index 1 is the value 
          //[[propertyname, value],[...]]
          
          actions.addAlert({ title: "Please Wait ", message: "Appointment is Getting Booked Right Now All the Form Information is Cleared", type: "warning" })
          
          
          const FormMap = Object.entries(e.targetValue)
          const arrayOfObjectsValues = Object.values(e.targetValue);
          const arrayOfObjectsKeys = Object.keys(e.targetValue);
          console.log(selectedContact)
          if (!selectedContact.contactId) {
            actions.addAlert({ title: "Error Message", message: "Pick a Contact", type: "danger" })
            setWorking(!working)
          } else {
            console.log("there is a contact")
            if (arrayOfObjectsValues.includes('') || yearIsValid == false) {
              // get addAlert from action package
              actions.addAlert({ title: "Error Message", message: "Fill out the Form Information", type: "danger" })
              setWorking(!working)
            } else {
              console.log(arrayOfObjectsValues)
              console.log(availability)
              let checkDup = await runServerless({ name: 'checkDuplicate', parameters: [selectedContact, e.targetValue] })
              console.log(checkDup)
              if (!checkDup.response) {
                actions.addAlert({ title: "Error Message", message: "There is an Appointment already existing", type: "danger" })
                setWorking(!working)
              }
              else {
                setMeetingLocation()
            setselectedsubAppointmentType()
            setselectedAppointmentType()
           setTaxYear()
            setAppointmentSubType()
                // check if the availability is valid       
                if (availability.find((obj) => obj.value == pickedTime)) {

                  console.log("valid entry")
                  console.log(Hosts[0])
                  console.log(bookingUserInfo)
                  console.log(selectedHost)
                  // default case
                  if (Hosts.find(obj => obj.label == selectedHost)) {
                    // console.log({likelyAvailableUserIds:bookingUserInfo.likelyAvailableUserIds,
                    //   legalConsentResponses: [{communicationTypeId: '302269988', consented: true}],
                    //   duration:cDuration, startTime: pickedTime, timezone:Hosts.find(obj=>obj.label==selectedHost).properties.hs_standard_time_zone, 
                    //   firstName:selectedContact.firstname, lastName: selectedContact.lastname, email: selectedContact.email,slug: bookingUserInfo.slug  })
                    let bookingInfo = {
                      likelyAvailableUserIds: bookingUserInfo.likelyAvailableUserIds,
                      legalConsentResponses: [{ communicationTypeId: '302269988', consented: true }],
                      duration: cDuration, startTime: pickedTime, timezone: Hosts.find(obj => obj.label == selectedHost).properties.hs_standard_time_zone,
                      firstName: selectedContact.firstname, lastName: selectedContact.lastname, email: selectedContact.email, slug: bookingUserInfo.slug, 
                    }

                    
                  

                        //run create an appointment and create associations

                        setWorking(!working)
                        setAvailability()
                        await runServerless({ name: 'getBookerId', parameters: [context, selectedHost] }).then(
                          async(owners ) => {
                        console.log(owners)
                        await runServerless({ name: 'createAppointment', parameters: [selectedContact, e.targetValue, context, {}, { Duration: cDuration, PickedTime: pickedTime, TimeZone: TimeZone, Booker:owners.response.booker, Owner: owners.response.AppointmentBooker },bookingInfo] }).then(
                          async (serverlessResponse) => {
                            if (serverlessResponse.status == 'SUCCESS') {
                              console.log(serverlessResponse)
                              console.log(selectedContact)
                              setWorking(!working)
                              await runServerless({ name: 'createAssociation', parameters: [serverlessResponse.response.id, context, selectedContact, {}] }).then(
                                (serverlessResponse) => {
                                  if (serverlessResponse.status == 'SUCCESS') {
                                    console.log(Object.keys(serverlessResponse))
                                    console.log(serverlessResponse.response)
                                    setWorking(!working)
                                    actions.addAlert({ title: "Success!", message: "Appointment Has Been Created!", type: "success" })
                                  }
                                }

                              );

                            }
                          }
                        );
                      })
                      
                    // selected Host case
                  } else {
                    console.log({
                      likelyAvailableUserIds: bookingUserInfo.likelyAvailableUserIds,
                      legalConsentResponses: [{ communicationTypeId: '302269988', consented: true }],
                      duration: cDuration, startTime: pickedTime, timezone: Hosts.find(obj => obj.label == selectedHost.label).properties.hs_standard_time_zone,
                      firstName: selectedContact.firstname, lastName: selectedContact.lastname, email: selectedContact.email, slug: bookingUserInfo.slug
                    })
                    let bookingInfo = {
                      likelyAvailableUserIds: bookingUserInfo.likelyAvailableUserIds,
                      legalConsentResponses: [{ communicationTypeId: '302269988', consented: true }],
                      duration: cDuration, startTime: pickedTime, timezone: Hosts.find(obj => obj.label == selectedHost.label).properties.hs_standard_time_zone,
                      firstName: selectedContact.firstname, lastName: selectedContact.lastname, email: selectedContact.email, slug: bookingUserInfo.slug, 
                    }
                    
                    
                        
                        actions.addAlert({ title: "Success!", message: "Appointment Has Been Created!", type: "success" })
                        setWorking(!working)
                        setAvailability()
                        //run create an appointment and create associations
                        await runServerless({ name: 'getBookerId', parameters: [context, selectedHost] }).then(
                          async(owners ) => {
                            console.log(owners)
                        await runServerless({ name: 'createAppointment', parameters: [selectedContact, e.targetValue, context, {}, { Duration: cDuration, PickedTime: pickedTime, TimeZone: TimeZone, Booker:owners.response.booker, Owner: owners.response.AppointmentBooker },bookingInfo] }).then(
                              async (createAppointmentResponse) => {
                                if (createAppointmentResponse.status == 'SUCCESS') {
  
                                  await runServerless({ name: 'createAssociation', parameters: [createAppointmentResponse.response.id, context, selectedContact, {}] }).then(
                                    (AssociationResponse) => {
                                      if (AssociationResponse.status == 'SUCCESS') {
                                        console.log(Object.keys(AssociationResponse))
                                        console.log(AssociationResponse.response)
                                        setWorking(!working)
                                        
                                      }
                                    }
  
                                  );
  
                                }
                              }
                            );
                        
                          }
                        )
                          
                          
                        
                      
                  }
                  console.log("meeting activity is created ")
                  //time out function to wait for the meeting activity to log 

                  //createAppointment first then create assoication after with the created appointment Id, because hubspot is broken

                }
                else {
                  actions.addAlert({ title: "Error Message", message: "Pick a Valid Time!", type: "danger" })
                  setWorking(!working)
                }
              }
            }
          }
        }}>
          <Flex direction={'row'} gap={'extra-large'} alignSelf={'start'}>
            <Box flex={1} alignSelf="end">
              <Select
                name="AppointmentType"
                label="Appointment Type"
                options={appointmentType}
                value={selectedAppointmentType}
                onChange={(e) => handleTypeSelection(e)}
                variant="primary"
                buttonSize="md"
                buttonText="More"
              ></Select>
            </Box>
            <Box flex={1} alignSelf="end">
              <Select
                name="Appointment Sub Type"
                label="Appointment Sub Type"
                options={appointmentSubType}
                value={selectedsubAppointmentType}
                onChange={(e) => setselectedsubAppointmentType(e)}
                variant="primary"
                buttonSize="md"
                buttonText="More"
              ></Select>
            </Box>
          </Flex>
          <Flex direction={'row'} gap={'extra-large'} alignSelf={'start'}>
            <Box flex={1} alignSelf="end">
              <Input label="Tax Year"
                name="TaxTerm"
                value={TaxYear}
                error={!yearIsValid}
                ref={inputRef}
                validationMessage={yearValidationMessage}
                onChange={(value) => {
                  let currentYear = new Date().getFullYear().toString()
                  let UpperLimit = new Number(currentYear) + 1
                  let first = currentYear.substring(2, 3);
                  console.log(first)
                  let second = new Number(currentYear.substring(3, 4)) + 1;
                  if (new String(value).search(new RegExp(`^(201[5-9]|20[${first}][0-${second}])$`)) < 0) {
                    setYearValidationMessage('Please Enter a Number between 2015 to ' + UpperLimit);
                    setYearIsValid(false);
                    setTaxYear(value)
                  } else {
                    setYearValidationMessage();
                    setYearIsValid(true);
                    setTaxYear(value)
                  }
                }}

              ></Input>
            </Box>
            <Box flex={1} alignSelf="end">
              <Select label="Host"
                name="Host"
                options={Hosts}
                onChange={(e) => handleSelectedHost(e)}
                error={!HostIsValid}
                validationMessage={HostValidationMessage}
                value={selectedHost}
                variant="primary"
                buttonSize="md"
                buttonText="More"
              ></Select>
            </Box>
          </Flex>
          <Select
            label="Preferred Meeting Location?"
            name="PreferredMeetingLocation"
            options={PreferredMeetingLocation}
            onChange={(value) => {
              setMeetingLocation(value);
            }}
            variant="primary"
            buttonSize="md"
            buttonText="More"
          ></Select>
          {
            renderLocation()
          }


          <DateInput name="StartDate" label="Date" required="true" onChange={(e) => setDate(e)} defaultValue={defaultDate}
            min={{ year: new Date().getFullYear(), month: new Date().getMonth(), date: new Date().getDate() }}
            max={{ year: new Date().getFullYear() + 1, month: new Date().getMonth() + 6, date: new Date().getDate() }}
            format="YYYY-MM-DD" />
          <Dropdown
            options={TimeZoneOptions}
            variant="transparent"
            buttonSize="md"
            buttonText={TimeZone}
          />


          <Flex justify={'center'}>
            <Text format={{ fontWeight: 'bold' }}>Available Duration</Text>
          </Flex>
          <Table bordered={false} paginated={false} flush={false} >


            <TableBody>

              {
                renderDurationList()
              }

            </TableBody>


          </Table>







          {/* <Button onClick={openMeetingLinkInterface}>
            MeetingTimeInterface
          </Button> */}




          {/* <NumberInput name="StartHour" label="StartHour" description="(24Hour Format 0=MidNight)" required="true" min={0} max={23} />
          <NumberInput name="StartMinute" label="StartMinute" required="true" min={0} max={59}  /> */}

          {/* <Select
         label="Duration"
          name="Duration"
          description="in Minutes"
          value={cDuration}
          // defaultvalue={{value:10800000, label:180}}
            onChange={(e)=>changeDuration(e)}
            options={Duration}
            variant="primary"
            buttonSize="md"
            buttonText="More"
          ></Select> */}





          {/* <Select
         label="Pick a Time"
          name="PickATime"
          value={pickedTime}
            options={availability}
            onChange={(e)=>handleAvailability(e)}
            variant="primary"
            buttonSize="md"
            buttonText="More"
          ></Select>   */}


          <Flex justify={'center'}>
            <Text format={{ fontWeight: 'bold' }}>Available Times</Text>
          </Flex>

          <Table bordered={false} paginated={false} flush={true}>



            <TableBody>

              {
                renderAvailableTime()
              }

            </TableBody>

          </Table>
          {/* <Flex direction="row" wrap="wrap" gap="extra-small" alignSelf="center">
            {
              renderAvailableTime()
            }
</Flex> */}
          <Divider />
          {SubmitButton()}
        </Form>

        {/* <Text ref={Ref}>write something here</Text> */}
      </Tile>





    </>
  );
};
