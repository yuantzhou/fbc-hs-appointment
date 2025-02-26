import React, { forwardRef, useEffect, useState } from "react";

import { useRef } from 'react';
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
  LoadingSpinner,Divider
} from "@hubspot/ui-extensions";
import {
  CrmActionButton,
  CrmActionLink,
  CrmCardActions,
} from '@hubspot/ui-extensions/crm';
import Day from "react-datepicker/dist/day";
import { newDate } from "react-datepicker/dist/date_utils";


// Define the extension to be run within the Hubspot CRM
hubspot.extend(({ context, runServerlessFunction, actions  }) => (
  <Extension
    context={context}
    runServerless={runServerlessFunction}
    sendAlert={actions}
    actions={actions}
    openIframe={actions.openIframeModal}
    
  />
));


// Define the Extension component, taking in runServerless, context, & sendAlert as props
const Extension = ({ context, runServerless, sendAlert, actions,openIframe}) => {
  const {
    fetchCrmObjectProperties,
    onCrmPropertiesUpdate,
    refreshObjectProperties,
  } = actions;
  //console.log(context)
  //const [properties, setProperties] = useState<Record<string, string>> ({});
  const [accountId, setAccountId] = useState(context.crm.objectId);
  const [selectedContact, setSelectedContact] = useState({});
  const [primaryContact, setPrimaryContact]= useState({});
  const [selectContactOptions, setSelectContactOptions] = useState([]);
  const [appointmentType,setAppointmentType]=useState([]);
  const [PreferredMeetingLocation,setPreferredMeetingLocation]=useState([]);
  const [Hosts, setHosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState({formattedDate:new Date().toISOString().substring(0,10)});
  const [selectedHost, setSelectedHost] = useState(context.user.firstName+" "+context.user.lastName);
  const [allAvailabilities, setAllAvailability]= useState();
  const [bookingUserInfo, setBookingUserInfo]= useState();
  const [formattedYear, setFormattedYear]= useState();
  //current availiablity array
  const [availability, setAvailability]= useState();
  const [working, setWorking]= useState(true);
  const [defaultDate, setDefaultDate]= useState({year:new Date().getFullYear(),month: new Date().getMonth(),date: new Date().getDate()});
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
          let PContact= serverlessResponse.response.find((element)=>element.type=="fbc_primary_contact")
          // [{label:contactCall.properties.firstname,value:contactCall.properties.firstname, type:contact.type, contactId:contact.id}]
          // change in getAssociatedContacts.js for more properties
          PContact.label= PContact.label+ " (Primary Contact)"
          setPrimaryContact(PContact)
          let CleanOptions=serverlessResponse.response.filter((element)=>element.type=="contact_to_fbc_accounts"&& element.value!= PContact.value) 
          CleanOptions.push(PContact) 
          setSelectContactOptions(CleanOptions);
          
        }
      }
    );
   
  }, []);
  //get Appointment Dropdown
  useEffect(() => {
    runServerless({ name: 'getDropDownOptions' }).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          console.log(serverlessResponse.response)
          setAppointmentType(serverlessResponse.response.results[1].options)
          setPreferredMeetingLocation(serverlessResponse.response.results[0].options)
        }
      }
    );
    console.log(selectedContact)
  }, []); 
//get Users 
  useEffect(async() => {
    await runServerless({ name: 'getUsers'}).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          let HostsObjectArray= serverlessResponse.response
          HostsObjectArray.map(obj => ( obj.label= obj.properties.hs_searchable_calculated_name, obj.value=obj.properties.hs_searchable_calculated_name ))
          console.log(HostsObjectArray)
          setHosts(HostsObjectArray)
          console.log(selectedHost)
        }
      }
    );
    
  }, []); 
   //get User and calendar availability use today's date as default range of avaliablity 
   //default parameters
   useEffect(async() => {
    await runServerless({ name: 'getUserInformation', parameters: { context:context } }).then(
      (serverlessResponse) => {
        if (serverlessResponse.status == 'SUCCESS') {
          console.log(serverlessResponse.response.response)
          let response = serverlessResponse.response.response
          let slug = serverlessResponse.response.slug
          if(response.linkAvailability["10800000"]){
            console.log("there a three hour default")
            let ThreeHourAva= response.linkAvailability.linkAvailabilityByDuration["10800000"].availabilities
            ThreeHourAva.map(obj => ( obj.value= obj.startMillisUtc, obj.label= new Date(obj.startMillisUtc).toString()  ))
            setAllAvailability(response.linkAvailability.linkAvailabilityByDuration)
            console.log(ThreeHourAva)
            setAvailability(ThreeHourAva.filter(obj =>new Date(obj.startMillisUtc).toISOString().substring(0,10)==selectedDate.formattedDate ) )
            let Durations = Object.keys(response.linkAvailability.linkAvailabilityByDuration)
            let DurationsObjectArray=Durations.map(obj => ( {value: obj, label: obj/60000} ))
            setDuration(DurationsObjectArray)
            setBookingUserInfo({likelyAvailableUserIds:[response.allUsersBusyTimes[0].meetingsUser.id.toString()], slug:slug})
          }else{
            console.log("please have a 3 hour default")
            let Durations = Object.keys(response.linkAvailability.linkAvailabilityByDuration)
            let DurationsObjectArray=Durations.map(obj => ( {value: obj, label: obj/60000} ))
            setBookingUserInfo({likelyAvailableUserIds:[response.allUsersBusyTimes[0].meetingsUser.id.toString()], slug:slug})
            setDuration(DurationsObjectArray)
            setAllAvailability(response.linkAvailability.linkAvailabilityByDuration)
          }
            
          
        }
      })
    console.log(selectedDate)
  }, []);
  //on Date change
  const setDate = (date) => {
    setSelectedDate(date)
    if(allAvailabilities[cDuration]){
      let availabilitiesObjectArray = allAvailabilities[cDuration].availabilities
      availabilitiesObjectArray.map(obj => ( obj.value= obj.startMillisUtc, obj.label= new Date(obj.startMillisUtc).toString()  ))
    
      setAvailability(availabilitiesObjectArray
        .filter(obj =>new Date(obj.startMillisUtc).toISOString().substring(0,10)==date.formattedDate))
    }else{
      let availabilitiesObjectArray=[]
      let durations= Object.keys(allAvailabilities)
      for(let Duration of durations){
        let ObjectArray = allAvailabilities[Duration].availabilities
        ObjectArray.map(obj => ( obj.value= obj.startMillisUtc, obj.label= new Date(obj.startMillisUtc).toString()  ))
        availabilitiesObjectArray.push(...ObjectArray)
      }
      setAvailability(availabilitiesObjectArray
        .filter(obj =>new Date(obj.startMillisUtc).toISOString().substring(0,10)==date.formattedDate))
    }
      
  };
  //on Duration Change
  const changeDuration = (duration) => {
    setCDuration(duration)
    let availabilitiesObjectArray = allAvailabilities[duration].availabilities
    availabilitiesObjectArray.map(obj => ( obj.value= obj.startMillisUtc, obj.label= new Date(obj.startMillisUtc).toString()  ))
    
    setAvailability(availabilitiesObjectArray
.filter(obj =>new Date(obj.startMillisUtc).toISOString().substring(0,10)==selectedDate.formattedDate))
  };
    const handleSelectedContact=(contactName)=>{
      console.log(selectContactOptions)
      let rightObject= selectContactOptions.find((element)=>element.value==contactName)
      setSelectedContact(rightObject)
      console.log(selectedContact)
      // setBookingInformation({likelyAvailableUserIds:[selectedHost.allUsersBusyTimes[0].meetingsUser.id.toString()],
      //   legalConsentResponses: [{communicationTypeId: '302269988', consented: true}],
      //   duration:cDuration, startTime: pickedTime, timezone:Hosts.find(obj=>obj.label==selectedHost).properties.hs_standard_time_zone, 
      //   firstName:selectedContact.firstname, lastName: selectedContact.lastname })
    }
    
   const handleSelectedHost =(Host)=>{
      let rightObject= Hosts.find((element)=>element.value==Host)
      setSelectedHost(rightObject)
      //console.log(selectedHost)
        runServerless({ name: 'getUserInformation', parameters: { context:context , Host: rightObject} }).then(
        (serverlessResponse) => {
          if (serverlessResponse.status == 'SUCCESS') {
            let response = serverlessResponse.response.response
            let slug = serverlessResponse.response.slug
            console.log(serverlessResponse.response)
            if (serverlessResponse.response=="calendar not connected"){
              setHostIsValid(false)
              setHostValidationMessage('This User have not set up their calendar');
            }else{
              setHostIsValid(true)
              setHostValidationMessage('Validate User');
            }
            
            setBookingUserInfo({likelyAvailableUserIds:[response.allUsersBusyTimes[0].meetingsUser.id.toString()], slug:slug})
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
   const handleAvailability=(TimeOption)=>{
   
    setPickedTime(TimeOption)
     console.log(pickedTime)
    // let test =availability.find((obj) => obj.value==TimeOption )
    // console.log(test)
    // if(availability.find((obj) => obj.value!=TimeOption )){
    //   console.log("can't find time")
    // }
  }
  const SubmitButton=()=>{
    if(working){
      return <Button type="submit" onClick={() => {
        console.log(`Someone clicked the button!${working}`);
        setWorking(!working)
      }}>Create an Appointment </Button>
    }else{
      return <LoadingSpinner label="Loading..." />
    }
  }
 
  return (
    <>
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
            onChange={(e)=>handleSelectedContact(e)}
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
        <Text format={{ fontWeight: 'demibold' }}>Appointment Type</Text>
        <Form onSubmit={async (e) => {
          // 2d array index 0 is the property name and index 1 is the value 
          //[[propertyname, value],[...]]
          const FormMap = Object.entries(e.targetValue)
        const arrayOfObjectsValues = Object.values(e.targetValue);
        const arrayOfObjectsKeys = Object.keys(e.targetValue);
        console.log(selectedContact)
        if(!selectedContact.contactId){
          actions.addAlert({title: "Error Message", message: "Pick a Contact", type: "danger"})
          setWorking(!working)
        }else{
          console.log("there is a contact")
        if(arrayOfObjectsValues.includes('')||yearIsValid==false){
          // get addAlert from action package
          actions.addAlert({title: "Error Message", message: "Fill out the Form Information", type: "danger"})
          setWorking(!working)
        }else{
          console.log(arrayOfObjectsValues)
          console.log(availability) 
          let checkDup=await runServerless({ name: 'checkDuplicate', parameters: [selectedContact,e.targetValue]})
          console.log(checkDup)
          if(!checkDup.response){
            actions.addAlert({title: "Error Message", message: "There is an Appointment already existing", type: "danger"})
            setWorking(!working)
          }
          else{
           
          // check if the availability is valid       
          if(availability.find((obj) => obj.value==arrayOfObjectsValues[5])){
            
            console.log("valid entry")
            console.log(Hosts[0])
            console.log(bookingUserInfo)
            console.log(selectedHost)
            // default case
            if(Hosts.find(obj =>obj.label==selectedHost)){
              // console.log({likelyAvailableUserIds:bookingUserInfo.likelyAvailableUserIds,
              //   legalConsentResponses: [{communicationTypeId: '302269988', consented: true}],
              //   duration:cDuration, startTime: pickedTime, timezone:Hosts.find(obj=>obj.label==selectedHost).properties.hs_standard_time_zone, 
              //   firstName:selectedContact.firstname, lastName: selectedContact.lastname, email: selectedContact.email,slug: bookingUserInfo.slug  })
                let bookingInfo={likelyAvailableUserIds:bookingUserInfo.likelyAvailableUserIds,
                  legalConsentResponses: [{communicationTypeId: '302269988', consented: true}],
                  duration:cDuration, startTime: pickedTime, timezone:Hosts.find(obj=>obj.label==selectedHost).properties.hs_standard_time_zone, 
                  firstName:selectedContact.firstname, lastName: selectedContact.lastname, email: selectedContact.email,slug: bookingUserInfo.slug }
                await runServerless({ name: 'bookMeeting', parameters: {bookingInfo:bookingInfo } }).then(
                  (BookMeetingResponse) => {     
                   
                    //run create an appointment and create associations
                    setTimeout(async() => {
                      console.log("wait is over searching for the meeting activity");
                      await runServerless({ name: 'createAppointment', parameters: [selectedContact,e.targetValue]}).then(
                       async (serverlessResponse) => {
                          if (serverlessResponse.status == 'SUCCESS') {
                           console.log(serverlessResponse)
                           console.log(selectedContact)
                           await runServerless({ name: 'createAssociation', parameters: [serverlessResponse.response.id,context.crm,selectedContact,BookMeetingResponse.response.calendarEventId]}).then(
                             (serverlessResponse) => {
                               if (serverlessResponse.status == 'SUCCESS') {
                                 console.log(Object.keys(serverlessResponse))
                                 console.log(serverlessResponse.response)
                                 setWorking(!working)
                                 actions.addAlert({title: "Success!", message: "Appointment Has Been Created!", type: "success"})
                                 }
                             }
                             
                           );
                           
                           }
                       }
                     );
                    }, 5000);
                  })
            // selected Host case
            }else{
              console.log({likelyAvailableUserIds:bookingUserInfo.likelyAvailableUserIds,
                legalConsentResponses: [{communicationTypeId: '302269988', consented: true}],
                duration:cDuration, startTime: pickedTime, timezone:Hosts.find(obj=>obj.label==selectedHost.label).properties.hs_standard_time_zone, 
                firstName:selectedContact.firstname, lastName: selectedContact.lastname, email: selectedContact.email, slug: bookingUserInfo.slug })
                let bookingInfo= {likelyAvailableUserIds:bookingUserInfo.likelyAvailableUserIds,
                  legalConsentResponses: [{communicationTypeId: '302269988', consented: true}],
                  duration:cDuration, startTime: pickedTime, timezone:Hosts.find(obj=>obj.label==selectedHost.label).properties.hs_standard_time_zone, 
                  firstName:selectedContact.firstname, lastName: selectedContact.lastname, email: selectedContact.email, slug: bookingUserInfo.slug }
                await runServerless({ name: 'bookMeeting', parameters: {bookingInfo:bookingInfo } }).then(
                  (BookMeetingResponse) => {
                     console.log(BookMeetingResponse.response.calendarEventId)
                      //run create an appointment and create associations
                    setTimeout(async() => {
                      console.log("wait is over searching for the meeting activity");
                      await runServerless({ name: 'createAppointment', parameters: [selectedContact,e.targetValue]}).then(
                       async (createAppointmentResponse) => {
                          if (createAppointmentResponse.status == 'SUCCESS') {
                       
                           await runServerless({ name: 'createAssociation', parameters: [createAppointmentResponse.response.id,context.crm,selectedContact,BookMeetingResponse.response.calendarEventId]}).then(
                             (AssociationResponse) => {
                               if (AssociationResponse.status == 'SUCCESS') {
                                 console.log(Object.keys(AssociationResponse))
                                 console.log(AssociationResponse.response)
                                 setWorking(!working)
                                 actions.addAlert({title: "Success!", message: "Appointment Has Been Created!", type: "success"})
                                 }
                             }
                             
                           );
                           
                           }
                       }
                     );
                    }, 5000);
                  })
            }
              console.log("meeting activity is created ")
              //time out function to wait for the meeting activity to log 
             
             //createAppointment first then create assoication after with the created appointment Id, because hubspot is broken
            
          }
          else{
            actions.addAlert({title: "Error Message", message: "Pick a Valid Time!", type: "danger"})
          }
        }
        }}
      }}>
        <Select
          name="AppointmentType"
            options={appointmentType}
            variant="primary"
            buttonSize="md"
            buttonText="More"
          ></Select>
          <Input label="Tax Year"
          name="TaxTerm"
          error={!yearIsValid}
        validationMessage={yearValidationMessage}
          onInput={(value) => {
            let currentYear = new Date().getFullYear().toString()
            let UpperLimit = new Number(currentYear)+1
              let first = currentYear.substring(2, 3);
              console.log(first)
            let second = new Number(currentYear.substring(3, 4))+1;
            if (value.search(new RegExp(`^(201[5-9]|20[${first}][0-${second}])$`))<0) {
              setYearValidationMessage('Please Enter a Number between 2015 to '+UpperLimit);
              setYearIsValid(false);
            }else{
              setYearValidationMessage('Valid Year');
              setYearIsValid(true);
            }
          }}
          ></Input>
          <Select
         label="Host"
          name="Host"
            options={Hosts}
            onChange={(e)=>handleSelectedHost(e)}
            error={!HostIsValid}
            validationMessage={HostValidationMessage}
            value= {selectedHost}
            variant="primary"
            buttonSize="md"
            buttonText="More"
          ></Select>
          
        <DateInput name="StartDate" label="Date"  required="true"onChange={(e)=>setDate(e)} defaultValue={defaultDate} />
        {/* {/* <Flex direction="row" align="end" gap="extra-small">
          <NumberInput name="StartHour" label="StartHour" description="(24Hour Format 0=MidNight)" required="true" min={0} max={23} />
          <NumberInput name="StartMinute" label="StartMinute" required="true" min={0} max={59}  />
        </Flex> */}
        <Select
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
          ></Select>
          <Select
         label="Pick a Time"
          name="PickATime"
          value={pickedTime}
            options={availability}
            onChange={(e)=>handleAvailability(e)}
            variant="primary"
            buttonSize="md"
            buttonText="More"
          ></Select>
          <Select
         label="Preferred Meeting Location?"
          name="PreferredMeetingLocation"
            options={PreferredMeetingLocation}
            variant="primary"
            buttonSize="md"
            buttonText="More"
          ></Select>
          <Divider />
          {SubmitButton()}
        </Form>
       
          {/* <Text ref={Ref}>write something here</Text> */}
      </Tile>
      

   
     
    </>
  );
};
