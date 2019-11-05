import Faker from 'faker';
import moment from 'moment';

const customers = [
        {
          "age": 44,
          "averageTransactionSpend": 34190,
          "banked": true,
          "cableTvSubscription": true,
          "commDomain": "safaricom",
          "commId": "+254 701 924144",
          "country": "Kenya",
          "county": "Nairobi",
          "educationLevel": "Completed Postgrad",
          "email": "Lane_Terry61@gmail.com",
          "employmentType": "Non-skilled worker",
          "familyCarOwnership": false,
          "firstName": "Alexandrea",
          "headOfHousehold": "25% to 50%",
          "internetAccess": true,
          "lastName": "Bode",
          "lastTransactionLocation": "Coast",
          "lastTransactionSpent": 8330,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "10",
          "npsScore": 8,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 93335,
          "profession": "null",
          "region": "Nyanza",
          "sex": "Male",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 10,
          "surveyResponseRate": 3,
          "surveysCompleted": 1,
          "surveysReceived": 2,
          "totalIncentivesReceived": 206,
          "totalTransactionSpend": 21645,
          "name": "Alexandrea Bode"
        },
        {
          "age": 50,
          "averageTransactionSpend": 7569,
          "banked": false,
          "cableTvSubscription": false,
          "commDomain": "airtel",
          "commId": "+254 758 201129",
          "country": "Kenya",
          "county": "Nyanza",
          "educationLevel": "Completed Postgrad",
          "email": "Candice.Lind@hotmail.com",
          "employmentType": "Farm Owner",
          "familyCarOwnership": false,
          "firstName": "Arvid",
          "headOfHousehold": "less than 25%",
          "internetAccess": true,
          "lastName": "Simonis",
          "lastTransactionLocation": "Coast",
          "lastTransactionSpent": 11743,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "13",
          "npsScore": 4,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 34782,
          "profession": "null",
          "region": "Nairobi",
          "sex": "Female",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 6,
          "surveyResponseRate": 3,
          "surveysCompleted": 3,
          "surveysReceived": 5,
          "totalIncentivesReceived": 843,
          "totalTransactionSpend": 15233,
          "name": "Arvid Simonis"
        },
        {
          "age": 58,
          "averageTransactionSpend": 41986,
          "banked": true,
          "cableTvSubscription": true,
          "commDomain": "airtel",
          "commId": "+254 786 729836",
          "country": "Kenya",
          "county": "Coast",
          "educationLevel": "College Student",
          "email": "Sylvester3@gmail.com",
          "employmentType": "Farm Owner",
          "familyCarOwnership": true,
          "firstName": "Rozella",
          "headOfHousehold": "50% to 75%",
          "internetAccess": false,
          "lastName": "Kilback",
          "lastTransactionLocation": "Coast",
          "lastTransactionSpent": 9790,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "13",
          "npsScore": 10,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 68149,
          "profession": "null",
          "region": "Eastern",
          "sex": "Other",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 7,
          "surveyResponseRate": 2,
          "surveysCompleted": 9,
          "surveysReceived": 5,
          "totalIncentivesReceived": 554,
          "totalTransactionSpend": 136047,
          "name": "Rozella Kilback"
        },
        {
          "age": 39,
          "averageTransactionSpend": 91396,
          "banked": true,
          "cableTvSubscription": false,
          "commDomain": "airtel",
          "commId": "+254 773 336018",
          "country": "Kenya",
          "county": "Coast",
          "educationLevel": "Completed Postgrad",
          "email": "Vernie_Zulauf37@yahoo.com",
          "employmentType": "Non-skilled worker",
          "familyCarOwnership": false,
          "firstName": "Christine",
          "headOfHousehold": "less than 25%",
          "internetAccess": false,
          "lastName": "Sanford",
          "lastTransactionLocation": "Nairobi",
          "lastTransactionSpent": 12864,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "13",
          "npsScore": 6,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 12962,
          "profession": "null",
          "region": "Eastern",
          "sex": "Female",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 3,
          "surveyResponseRate": 10,
          "surveysCompleted": 4,
          "surveysReceived": 2,
          "totalIncentivesReceived": 679,
          "totalTransactionSpend": 52278,
          "name": "Christine Sanford"
        },
        {
          "age": 35,
          "averageTransactionSpend": 46333,
          "banked": true,
          "cableTvSubscription": true,
          "commDomain": "safaricom",
          "commId": "+254 797 083631",
          "country": "Kenya",
          "county": "Coast",
          "educationLevel": "Completed College",
          "email": "Kenyatta57@hotmail.com",
          "employmentType": "Non-skilled worker",
          "familyCarOwnership": true,
          "firstName": "Payton",
          "headOfHousehold": "50% to 75%",
          "internetAccess": false,
          "lastName": "Rutherford",
          "lastTransactionLocation": "Nyanza",
          "lastTransactionSpent": 9935,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "11",
          "npsScore": 3,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 74349,
          "profession": "null",
          "region": "Central",
          "sex": "Other",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 0,
          "surveyResponseRate": 4,
          "surveysCompleted": 3,
          "surveysReceived": 7,
          "totalIncentivesReceived": 387,
          "totalTransactionSpend": 55608,
          "name": "Payton Rutherford"
        },
        {
          "age": 61,
          "averageTransactionSpend": 72027,
          "banked": false,
          "cableTvSubscription": true,
          "commDomain": "airtel",
          "commId": "+254 700 291928",
          "country": "Kenya",
          "county": "Coast",
          "educationLevel": "Completed College",
          "email": "Leanna_Kozey@yahoo.com",
          "employmentType": "Skilled worker",
          "familyCarOwnership": false,
          "firstName": "Heaven",
          "headOfHousehold": "more than 75%",
          "internetAccess": false,
          "lastName": "Vandervort",
          "lastTransactionLocation": "Central",
          "lastTransactionSpent": 11102,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "10",
          "npsScore": 8,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 55530,
          "profession": "null",
          "region": "Coast",
          "sex": "Male",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 5,
          "surveyResponseRate": 5,
          "surveysCompleted": 10,
          "surveysReceived": 6,
          "totalIncentivesReceived": 256,
          "totalTransactionSpend": 84431,
          "name": "Heaven Vandervort"
        },
        {
          "age": 23,
          "averageTransactionSpend": 75675,
          "banked": true,
          "cableTvSubscription": true,
          "commDomain": "safaricom",
          "commId": "+254 739 132433",
          "country": "Kenya",
          "county": "Central",
          "educationLevel": "Completed College",
          "email": "Telly.Predovic@gmail.com",
          "employmentType": "Non-skilled worker",
          "familyCarOwnership": true,
          "firstName": "Libby",
          "headOfHousehold": "50% to 75%",
          "internetAccess": false,
          "lastName": "Wolff",
          "lastTransactionLocation": "Nairobi",
          "lastTransactionSpent": 7914,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "13",
          "npsScore": 5,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 5403,
          "profession": "null",
          "region": "Eastern",
          "sex": "Other",
          "smartPhoneOwnership": true,
          "surveyCompletionRate": 3,
          "surveyResponseRate": 0,
          "surveysCompleted": 10,
          "surveysReceived": 8,
          "totalIncentivesReceived": 591,
          "totalTransactionSpend": 58617,
          "name": "Libby Wolff"
        },
        {
          "age": 34,
          "averageTransactionSpend": 60626,
          "banked": true,
          "cableTvSubscription": true,
          "commDomain": "airtel",
          "commId": "+254 747 775001",
          "country": "Kenya",
          "county": "Central",
          "educationLevel": "Completed Secondary",
          "email": "Mazie.Willms@gmail.com",
          "employmentType": "Own Business",
          "familyCarOwnership": true,
          "firstName": "Norval",
          "headOfHousehold": "25% to 50%",
          "internetAccess": true,
          "lastName": "Davis",
          "lastTransactionLocation": "Nyanza",
          "lastTransactionSpent": 5326,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "11",
          "npsScore": 4,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 45141,
          "profession": "null",
          "region": "Central",
          "sex": "Other",
          "smartPhoneOwnership": true,
          "surveyCompletionRate": 5,
          "surveyResponseRate": 9,
          "surveysCompleted": 1,
          "surveysReceived": 5,
          "totalIncentivesReceived": 996,
          "totalTransactionSpend": 35647,
          "name": "Norval Davis"
        },
        {
          "age": 66,
          "averageTransactionSpend": 52815,
          "banked": false,
          "cableTvSubscription": false,
          "commDomain": "airtel",
          "commId": "+254 785 240350",
          "country": "Kenya",
          "county": "Nairobi",
          "educationLevel": "Completed Primary",
          "email": "Kaylie.Osinski1@hotmail.com",
          "employmentType": "Skilled worker",
          "familyCarOwnership": false,
          "firstName": "Raul",
          "headOfHousehold": "25% to 50%",
          "internetAccess": false,
          "lastName": "Sawayn",
          "lastTransactionLocation": "Eastern",
          "lastTransactionSpent": 8613,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "13",
          "npsScore": 5,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 57676,
          "profession": "null",
          "region": "Central",
          "sex": "Female",
          "smartPhoneOwnership": true,
          "surveyCompletionRate": 5,
          "surveyResponseRate": 8,
          "surveysCompleted": 2,
          "surveysReceived": 9,
          "totalIncentivesReceived": 605,
          "totalTransactionSpend": 17664,
          "name": "Raul Sawayn"
        },
        {
          "age": 51,
          "averageTransactionSpend": 70705,
          "banked": true,
          "cableTvSubscription": true,
          "commDomain": "airtel",
          "commId": "+254 781 409770",
          "country": "Kenya",
          "county": "Central",
          "educationLevel": "Completed Secondary",
          "email": "Adan.Carroll@hotmail.com",
          "employmentType": "Non-skilled worker",
          "familyCarOwnership": true,
          "firstName": "Jameson",
          "headOfHousehold": "more than 75%",
          "internetAccess": false,
          "lastName": "Adams",
          "lastTransactionLocation": "Nyanza",
          "lastTransactionSpent": 2944,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "13",
          "npsScore": 2,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 8058,
          "profession": "null",
          "region": "Nairobi",
          "sex": "Female",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 5,
          "surveyResponseRate": 10,
          "surveysCompleted": 4,
          "surveysReceived": 7,
          "totalIncentivesReceived": 239,
          "totalTransactionSpend": 112860,
          "name": "Jameson Adams"
        },
        {
          "age": 41,
          "averageTransactionSpend": 95410,
          "banked": true,
          "cableTvSubscription": true,
          "commDomain": "airtel",
          "commId": "+254 702 254999",
          "country": "Kenya",
          "county": "Nairobi",
          "educationLevel": "Completed College",
          "email": "Natalie_Kilback57@hotmail.com",
          "employmentType": "Farm Owner",
          "familyCarOwnership": true,
          "firstName": "Kailyn",
          "headOfHousehold": "50% to 75%",
          "internetAccess": true,
          "lastName": "Feest",
          "lastTransactionLocation": "Eastern",
          "lastTransactionSpent": 9758,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "10",
          "npsScore": 1,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 43246,
          "profession": "null",
          "region": "Nyanza",
          "sex": "Female",
          "smartPhoneOwnership": true,
          "surveyCompletionRate": 9,
          "surveyResponseRate": 10,
          "surveysCompleted": 10,
          "surveysReceived": 3,
          "totalIncentivesReceived": 222,
          "totalTransactionSpend": 18509,
          "name": "Kailyn Feest"
        },
        {
          "age": 24,
          "averageTransactionSpend": 43063,
          "banked": true,
          "cableTvSubscription": true,
          "commDomain": "safaricom",
          "commId": "+254 782 138790",
          "country": "Kenya",
          "county": "Nyanza",
          "educationLevel": "Completed Postgrad",
          "email": "Efrain84@hotmail.com",
          "employmentType": "Farm Owner",
          "familyCarOwnership": false,
          "firstName": "Herman",
          "headOfHousehold": "less than 25%",
          "internetAccess": true,
          "lastName": "Schowalter",
          "lastTransactionLocation": "Nairobi",
          "lastTransactionSpent": 6947,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "10",
          "npsScore": 10,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 75465,
          "profession": "null",
          "region": "Coast",
          "sex": "Female",
          "smartPhoneOwnership": true,
          "surveyCompletionRate": 9,
          "surveyResponseRate": 10,
          "surveysCompleted": 6,
          "surveysReceived": 8,
          "totalIncentivesReceived": 698,
          "totalTransactionSpend": 60521,
          "name": "Herman Schowalter"
        },
        {
          "age": 68,
          "averageTransactionSpend": 47921,
          "banked": false,
          "cableTvSubscription": false,
          "commDomain": "safaricom",
          "commId": "+254 783 728350",
          "country": "Kenya",
          "county": "Coast",
          "educationLevel": "Completed College",
          "email": "Elyse58@yahoo.com",
          "employmentType": "Own Business",
          "familyCarOwnership": true,
          "firstName": "German",
          "headOfHousehold": "less than 25%",
          "internetAccess": true,
          "lastName": "Terry",
          "lastTransactionLocation": "Nyanza",
          "lastTransactionSpent": 3973,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "11",
          "npsScore": 0,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 49418,
          "profession": "null",
          "region": "Coast",
          "sex": "Other",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 0,
          "surveyResponseRate": 7,
          "surveysCompleted": 7,
          "surveysReceived": 1,
          "totalIncentivesReceived": 311,
          "totalTransactionSpend": 133160,
          "name": "German Terry"
        },
        {
          "age": 70,
          "averageTransactionSpend": 60629,
          "banked": true,
          "cableTvSubscription": true,
          "commDomain": "airtel",
          "commId": "+254 726 848753",
          "country": "Kenya",
          "county": "Eastern",
          "educationLevel": "Completed Secondary",
          "email": "Larry.Walker@gmail.com",
          "employmentType": "Other/Unemployed",
          "familyCarOwnership": true,
          "firstName": "Sigrid",
          "headOfHousehold": "25% to 50%",
          "internetAccess": true,
          "lastName": "Jacobson",
          "lastTransactionLocation": "Eastern",
          "lastTransactionSpent": 4199,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "13",
          "npsScore": 10,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 80470,
          "profession": "null",
          "region": "Coast",
          "sex": "Other",
          "smartPhoneOwnership": true,
          "surveyCompletionRate": 1,
          "surveyResponseRate": 6,
          "surveysCompleted": 2,
          "surveysReceived": 6,
          "totalIncentivesReceived": 625,
          "totalTransactionSpend": 100573,
          "name": "Sigrid Jacobson"
        },
        {
          "age": 67,
          "averageTransactionSpend": 62370,
          "banked": true,
          "cableTvSubscription": false,
          "commDomain": "airtel",
          "commId": "+254 792 652355",
          "country": "Kenya",
          "county": "Nyanza",
          "educationLevel": "Completed Primary",
          "email": "Alysson_Goodwin77@yahoo.com",
          "employmentType": "Farm Owner",
          "familyCarOwnership": true,
          "firstName": "Vesta",
          "headOfHousehold": "50% to 75%",
          "internetAccess": false,
          "lastName": "Pollich",
          "lastTransactionLocation": "Nyanza",
          "lastTransactionSpent": 6482,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "13",
          "npsScore": 7,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 70099,
          "profession": "null",
          "region": "Coast",
          "sex": "Female",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 10,
          "surveyResponseRate": 7,
          "surveysCompleted": 9,
          "surveysReceived": 7,
          "totalIncentivesReceived": 608,
          "totalTransactionSpend": 35687,
          "name": "Vesta Pollich"
        },
        {
          "age": 52,
          "averageTransactionSpend": 19820,
          "banked": true,
          "cableTvSubscription": true,
          "commDomain": "safaricom",
          "commId": "+254 790 500924",
          "country": "Kenya",
          "county": "Coast",
          "educationLevel": "Completed Secondary",
          "email": "Newton17@hotmail.com",
          "employmentType": "Farm Owner",
          "familyCarOwnership": false,
          "firstName": "Elijah",
          "headOfHousehold": "25% to 50%",
          "internetAccess": false,
          "lastName": "Grimes",
          "lastTransactionLocation": "Coast",
          "lastTransactionSpent": 14985,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "12",
          "npsScore": 5,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 97110,
          "profession": "null",
          "region": "Central",
          "sex": "Other",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 8,
          "surveyResponseRate": 10,
          "surveysCompleted": 10,
          "surveysReceived": 5,
          "totalIncentivesReceived": 952,
          "totalTransactionSpend": 147609,
          "name": "Elijah Grimes"
        },
        {
          "age": 35,
          "averageTransactionSpend": 43269,
          "banked": true,
          "cableTvSubscription": false,
          "commDomain": "airtel",
          "commId": "+254 755 713874",
          "country": "Kenya",
          "county": "Coast",
          "educationLevel": "College Student",
          "email": "Brennan.Pollich9@gmail.com",
          "employmentType": "Skilled worker",
          "familyCarOwnership": true,
          "firstName": "Lourdes",
          "headOfHousehold": "50% to 75%",
          "internetAccess": false,
          "lastName": "Murazik",
          "lastTransactionLocation": "Coast",
          "lastTransactionSpent": 2535,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "10",
          "npsScore": 4,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 69392,
          "profession": "null",
          "region": "Eastern",
          "sex": "Male",
          "smartPhoneOwnership": true,
          "surveyCompletionRate": 7,
          "surveyResponseRate": 7,
          "surveysCompleted": 1,
          "surveysReceived": 2,
          "totalIncentivesReceived": 853,
          "totalTransactionSpend": 95745,
          "name": "Lourdes Murazik"
        },
        {
          "age": 24,
          "averageTransactionSpend": 66592,
          "banked": true,
          "cableTvSubscription": false,
          "commDomain": "safaricom",
          "commId": "+254 710 032351",
          "country": "Kenya",
          "county": "Nyanza",
          "educationLevel": "Completed Primary",
          "email": "Eladio_Swift78@gmail.com",
          "employmentType": "Other/Unemployed",
          "familyCarOwnership": false,
          "firstName": "Earl",
          "headOfHousehold": "less than 25%",
          "internetAccess": true,
          "lastName": "Hills",
          "lastTransactionLocation": "Nairobi",
          "lastTransactionSpent": 8920,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "1",
          "npsScore": 1,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 23191,
          "profession": "null",
          "region": "Nairobi",
          "sex": "Female",
          "smartPhoneOwnership": true,
          "surveyCompletionRate": 4,
          "surveyResponseRate": 9,
          "surveysCompleted": 6,
          "surveysReceived": 8,
          "totalIncentivesReceived": 427,
          "totalTransactionSpend": 71923,
          "name": "Earl Hills"
        },
        {
          "age": 33,
          "averageTransactionSpend": 85892,
          "banked": false,
          "cableTvSubscription": false,
          "commDomain": "airtel",
          "commId": "+254 742 177508",
          "country": "Kenya",
          "county": "Nairobi",
          "educationLevel": "Completed Secondary",
          "email": "Judson_Shanahan@gmail.com",
          "employmentType": "Farm Owner",
          "familyCarOwnership": true,
          "firstName": "Davion",
          "headOfHousehold": "more than 75%",
          "internetAccess": false,
          "lastName": "Mueller",
          "lastTransactionLocation": "Coast",
          "lastTransactionSpent": 7179,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "10",
          "npsScore": 9,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 4908,
          "profession": "null",
          "region": "Eastern",
          "sex": "Other",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 2,
          "surveyResponseRate": 5,
          "surveysCompleted": 9,
          "surveysReceived": 9,
          "totalIncentivesReceived": 790,
          "totalTransactionSpend": 59736,
          "name": "Davion Mueller"
        },
        {
          "age": 67,
          "averageTransactionSpend": 88297,
          "banked": true,
          "cableTvSubscription": false,
          "commDomain": "airtel",
          "commId": "+254 731 741667",
          "country": "Kenya",
          "county": "Eastern",
          "educationLevel": "College Student",
          "email": "Frederique_Rodriguez@gmail.com",
          "employmentType": "Farm Owner",
          "familyCarOwnership": false,
          "firstName": "Alexis",
          "headOfHousehold": "25% to 50%",
          "internetAccess": false,
          "lastName": "Howe",
          "lastTransactionLocation": "Coast",
          "lastTransactionSpent": 3622,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "1",
          "npsScore": 4,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 7161,
          "profession": "null",
          "region": "Nyanza",
          "sex": "Female",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 8,
          "surveyResponseRate": 8,
          "surveysCompleted": 3,
          "surveysReceived": 10,
          "totalIncentivesReceived": 741,
          "totalTransactionSpend": 139288,
          "name": "Alexis Howe"
        },
        {
          "age": 40,
          "averageTransactionSpend": 64385,
          "banked": true,
          "cableTvSubscription": false,
          "commDomain": "safaricom",
          "commId": "+254 737 270265",
          "country": "Kenya",
          "county": "Nyanza",
          "educationLevel": "Completed College",
          "email": "Eliezer.Lowe22@hotmail.com",
          "employmentType": "Non-skilled worker",
          "familyCarOwnership": true,
          "firstName": "Jordon",
          "headOfHousehold": "25% to 50%",
          "internetAccess": false,
          "lastName": "Rodriguez",
          "lastTransactionLocation": "Eastern",
          "lastTransactionSpent": 4990,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "12",
          "npsScore": 8,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 21560,
          "profession": "null",
          "region": "Nairobi",
          "sex": "Female",
          "smartPhoneOwnership": true,
          "surveyCompletionRate": 3,
          "surveyResponseRate": 0,
          "surveysCompleted": 5,
          "surveysReceived": 4,
          "totalIncentivesReceived": 983,
          "totalTransactionSpend": 136975,
          "name": "Jordon Rodriguez"
        },
        {
          "age": 36,
          "averageTransactionSpend": 1956,
          "banked": false,
          "cableTvSubscription": true,
          "commDomain": "airtel",
          "commId": "+254 790 014330",
          "country": "Kenya",
          "county": "Central",
          "educationLevel": "College Student",
          "email": "Thomas87@hotmail.com",
          "employmentType": "Non-skilled worker",
          "familyCarOwnership": false,
          "firstName": "Janie",
          "headOfHousehold": "more than 75%",
          "internetAccess": false,
          "lastName": "Feeney",
          "lastTransactionLocation": "Coast",
          "lastTransactionSpent": 8490,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "11",
          "npsScore": 6,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 29793,
          "profession": "null",
          "region": "Coast",
          "sex": "Other",
          "smartPhoneOwnership": true,
          "surveyCompletionRate": 10,
          "surveyResponseRate": 10,
          "surveysCompleted": 5,
          "surveysReceived": 0,
          "totalIncentivesReceived": 313,
          "totalTransactionSpend": 145684,
          "name": "Janie Feeney"
        },
        {
          "age": 59,
          "averageTransactionSpend": 49963,
          "banked": false,
          "cableTvSubscription": true,
          "commDomain": "airtel",
          "commId": "+254 780 921548",
          "country": "Kenya",
          "county": "Nyanza",
          "educationLevel": "Completed Postgrad",
          "email": "Royce_Baumbach76@gmail.com",
          "employmentType": "Non-skilled worker",
          "familyCarOwnership": false,
          "firstName": "Adelia",
          "headOfHousehold": "50% to 75%",
          "internetAccess": false,
          "lastName": "Grimes",
          "lastTransactionLocation": "Central",
          "lastTransactionSpent": 3877,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "11",
          "npsScore": 4,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 84363,
          "profession": "null",
          "region": "Nairobi",
          "sex": "Other",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 7,
          "surveyResponseRate": 1,
          "surveysCompleted": 4,
          "surveysReceived": 8,
          "totalIncentivesReceived": 862,
          "totalTransactionSpend": 30238,
          "name": "Adelia Grimes"
        },
        {
          "age": 40,
          "averageTransactionSpend": 10580,
          "banked": false,
          "cableTvSubscription": true,
          "commDomain": "safaricom",
          "commId": "+254 767 381220",
          "country": "Kenya",
          "county": "Central",
          "educationLevel": "Completed College",
          "email": "Ken6@gmail.com",
          "employmentType": "Skilled worker",
          "familyCarOwnership": true,
          "firstName": "Felicia",
          "headOfHousehold": "25% to 50%",
          "internetAccess": true,
          "lastName": "Prosacco",
          "lastTransactionLocation": "Eastern",
          "lastTransactionSpent": 1994,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "11",
          "npsScore": 10,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 56680,
          "profession": "null",
          "region": "Coast",
          "sex": "Female",
          "smartPhoneOwnership": true,
          "surveyCompletionRate": 9,
          "surveyResponseRate": 2,
          "surveysCompleted": 4,
          "surveysReceived": 9,
          "totalIncentivesReceived": 676,
          "totalTransactionSpend": 50542,
          "name": "Felicia Prosacco"
        },
        {
          "age": 18,
          "averageTransactionSpend": 99943,
          "banked": true,
          "cableTvSubscription": false,
          "commDomain": "safaricom",
          "commId": "+254 763 240450",
          "country": "Kenya",
          "county": "Coast",
          "educationLevel": "Completed Primary",
          "email": "Gene_Becker82@gmail.com",
          "employmentType": "Non-skilled worker",
          "familyCarOwnership": true,
          "firstName": "Elnora",
          "headOfHousehold": "50% to 75%",
          "internetAccess": true,
          "lastName": "Zieme",
          "lastTransactionLocation": "Coast",
          "lastTransactionSpent": 2814,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "11",
          "npsScore": 0,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 51295,
          "profession": "null",
          "region": "Nairobi",
          "sex": "Other",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 3,
          "surveyResponseRate": 9,
          "surveysCompleted": 1,
          "surveysReceived": 9,
          "totalIncentivesReceived": 503,
          "totalTransactionSpend": 77141,
          "name": "Elnora Zieme"
        },
        {
          "age": 51,
          "averageTransactionSpend": 15689,
          "banked": true,
          "cableTvSubscription": true,
          "commDomain": "airtel",
          "commId": "+254 732 074608",
          "country": "Kenya",
          "county": "Eastern",
          "educationLevel": "Completed College",
          "email": "Emmie.Roob28@gmail.com",
          "employmentType": "Other/Unemployed",
          "familyCarOwnership": false,
          "firstName": "Julie",
          "headOfHousehold": "less than 25%",
          "internetAccess": true,
          "lastName": "Carter",
          "lastTransactionLocation": "Nyanza",
          "lastTransactionSpent": 5381,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "10",
          "npsScore": 6,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 46424,
          "profession": "null",
          "region": "Nyanza",
          "sex": "Other",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 5,
          "surveyResponseRate": 5,
          "surveysCompleted": 4,
          "surveysReceived": 8,
          "totalIncentivesReceived": 912,
          "totalTransactionSpend": 68689,
          "name": "Julie Carter"
        },
        {
          "age": 53,
          "averageTransactionSpend": 75546,
          "banked": false,
          "cableTvSubscription": true,
          "commDomain": "safaricom",
          "commId": "+254 779 387262",
          "country": "Kenya",
          "county": "Central",
          "educationLevel": "Completed College",
          "email": "Breanne.OConner17@hotmail.com",
          "employmentType": "Non-skilled worker",
          "familyCarOwnership": false,
          "firstName": "Palma",
          "headOfHousehold": "less than 25%",
          "internetAccess": true,
          "lastName": "Gerhold",
          "lastTransactionLocation": "Eastern",
          "lastTransactionSpent": 14734,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "1",
          "npsScore": 9,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 34028,
          "profession": "null",
          "region": "Central",
          "sex": "Male",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 8,
          "surveyResponseRate": 6,
          "surveysCompleted": 7,
          "surveysReceived": 0,
          "totalIncentivesReceived": 600,
          "totalTransactionSpend": 10627,
          "name": "Palma Gerhold"
        },
        {
          "age": 65,
          "averageTransactionSpend": 64249,
          "banked": true,
          "cableTvSubscription": true,
          "commDomain": "safaricom",
          "commId": "+254 782 674503",
          "country": "Kenya",
          "county": "Nyanza",
          "educationLevel": "College Student",
          "email": "Miracle_Daugherty@yahoo.com",
          "employmentType": "Non-skilled worker",
          "familyCarOwnership": false,
          "firstName": "Lurline",
          "headOfHousehold": "25% to 50%",
          "internetAccess": false,
          "lastName": "Crona",
          "lastTransactionLocation": "Coast",
          "lastTransactionSpent": 2387,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "12",
          "npsScore": 9,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 79381,
          "profession": "null",
          "region": "Eastern",
          "sex": "Female",
          "smartPhoneOwnership": false,
          "surveyCompletionRate": 5,
          "surveyResponseRate": 4,
          "surveysCompleted": 3,
          "surveysReceived": 7,
          "totalIncentivesReceived": 919,
          "totalTransactionSpend": 144513,
          "name": "Lurline Crona"
        },
        {
          "age": 52,
          "averageTransactionSpend": 42015,
          "banked": false,
          "cableTvSubscription": false,
          "commDomain": "airtel",
          "commId": "+254 764 117289",
          "country": "Kenya",
          "county": "Coast",
          "educationLevel": "Completed Postgrad",
          "email": "Bell_Lemke95@gmail.com",
          "employmentType": "Non-skilled worker",
          "familyCarOwnership": true,
          "firstName": "Arjun",
          "headOfHousehold": "less than 25%",
          "internetAccess": false,
          "lastName": "Kohler",
          "lastTransactionLocation": "Nairobi",
          "lastTransactionSpent": 8442,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "12",
          "npsScore": 10,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 16827,
          "profession": "null",
          "region": "Eastern",
          "sex": "Other",
          "smartPhoneOwnership": true,
          "surveyCompletionRate": 10,
          "surveyResponseRate": 7,
          "surveysCompleted": 7,
          "surveysReceived": 3,
          "totalIncentivesReceived": 421,
          "totalTransactionSpend": 135130,
          "name": "Arjun Kohler"
        },
        {
          "age": 66,
          "averageTransactionSpend": 78916,
          "banked": true,
          "cableTvSubscription": true,
          "commDomain": "airtel",
          "commId": "+254 729 155825",
          "country": "Kenya",
          "county": "Eastern",
          "educationLevel": "Completed College",
          "email": "Kirstin41@hotmail.com",
          "employmentType": "Skilled worker",
          "familyCarOwnership": true,
          "firstName": "Shaylee",
          "headOfHousehold": "more than 75%",
          "internetAccess": true,
          "lastName": "Zboncak",
          "lastTransactionLocation": "Nairobi",
          "lastTransactionSpent": 14457,
          "lastTransactionTimestamp": 1547078400000,
          "lsm": "1",
          "npsScore": 4,
          "npsTags": "null",
          "otherDetail": null,
          "participantAsset": "null",
          "participantId": 76521,
          "profession": "null",
          "region": "Nairobi",
          "sex": "Other",
          "smartPhoneOwnership": true,
          "surveyCompletionRate": 1,
          "surveyResponseRate": 5,
          "surveysCompleted": 2,
          "surveysReceived": 3,
          "totalIncentivesReceived": 963,
          "totalTransactionSpend": 142178,
          "name": "Shaylee Zboncak"
        }
];
const filteredCustomers = [];
const counties = ['Nairobi', 'Central', 'Coast', 'Eastern', 'Nyanza'];
const educationLevel = ['College Student', 'Completed College', 'Completed Postgrad', 'Completed Primary', 'Completed Secondary'];
const employmentType = ['Farm Owner', 'Non-skilled worker', 'Other/Unemployed', 'Own Business', 'Skilled worker'];
const headOfHousehold = ['25% to 50%', '50% to 75%', 'less than 25%', 'more than 75%'];
const lsm = ['1', '10', '11', '12', '13'];
const gender = ['Male', 'Female', 'Other'];
const npsScore = ['DETRACTORS', 'PASSIVES', 'PROMOTERS'];
const ages = ['18 - 30', '31 - 40', '41 - 50', '51 - 60', '61 - 70']

function createDummyCustomers(appliedFilters = [], count = 30) {

    // let appliedGender;
    // let appliedNpsScore;
    // let appliedRegion;
    // let appliedLsm;
    // let appliedEmploymentType;
    // let appliedCounty;
    // let appliedLevelOfEducation
    // let appliedBanked;
    // let appliedInternetAccess;
    // let appliedHeadOfHousehold;
    // let appliedCableTvSubscription;

    // if (appliedFilters.length) {
    //     appliedGender = getAppliedFilter(appliedFilters, 'gender');
    //     appliedNpsScore = getAppliedFilter(appliedFilters, 'npsSCore');
    //     appliedRegion = getAppliedFilter(appliedFilters, 'region');
    //     appliedCounty = getAppliedFilter(appliedFilters, 'county');
    //     appliedLevelOfEducation = getAppliedFilter(appliedFilters, 'educationLevel');
    //     appliedEmploymentType = getAppliedFilter(appliedFilters, 'employmentType');
    //     appliedHeadOfHousehold = getAppliedFilter(appliedFilters, 'headOfHousehold');
    // }

    // if(!customers.length || appliedFilters.length) {
    //     for (let i = 0; i < count; i++) {
    //         const customer = {
    //             age: Faker.random.number({ min: 18, max: 70 }),
    //             averageTransactionSpend: Faker.random.number(),
    //             banked: Faker.random.boolean(),
    //             cableTvSubscription: Faker.random.boolean(),
    //             commDomain: Faker.random.arrayElement(['safaricom', 'airtel']),
    //             commId: Faker.phone.phoneNumber('+254 7## ######'),
    //             country: 'Kenya',
    //             county: Faker.random.arrayElement(appliedCounty !== undefined ? appliedCounty.options : counties),
    //             educationLevel: Faker.random.arrayElement(appliedLevelOfEducation !== undefined ? appliedLevelOfEducation.options : educationLevel),
    //             email: Faker.internet.email(),
    //             employmentType: Faker.random.arrayElement(appliedEmploymentType !== undefined ? appliedEmploymentType.options : employmentType),
    //             familyCarOwnership: Faker.random.boolean(),
    //             firstName: Faker.name.firstName(),
    //             headOfHousehold: Faker.random.arrayElement(appliedHeadOfHousehold !== undefined ? appliedHeadOfHousehold.options : headOfHousehold),
    //             internetAccess: Faker.random.boolean(),
    //             lastName: Faker.name.lastName(),
    //             lastTransactionLocation: Faker.random.arrayElement(counties),
    //             lastTransactionSpent: Faker.random.number({ min: 1000, max: 15000 }),
    //             lastTransactionTimestamp: 1547078400000,
    //             lsm: Faker.random.arrayElement(appliedLsm !== undefined ? appliedLsm.options : lsm),
    //             npsScore: Faker.random.number(10),
    //             npsTags: "null",
    //             otherDetail: null,
    //             participantAsset: "null",
    //             participantId: Faker.random.number(),
    //             profession: "null",
    //             region: Faker.random.arrayElement(appliedRegion !== undefined ? appliedRegion.options : counties),
    //             sex: Faker.random.arrayElement(appliedGender !== undefined ? appliedGender.options : gender),
    //             smartPhoneOwnership: Faker.random.boolean(),
    //             surveyCompletionRate: Faker.random.number(10),
    //             surveyResponseRate: Faker.random.number(10),
    //             surveysCompleted: Faker.random.number(10),
    //             surveysReceived: Faker.random.number(10),
    //             totalIncentivesReceived: Faker.random.number({ min: 100, max: 1000 }),
    //             totalTransactionSpend: Faker.random.number({ min: 1000, max: 150000 }),
    //         }

    //         if (appliedFilters.length) {
    //             filteredCustomers.push(customer);
    //         } else {
    //             customers.push(customer);
    //         }
    //     }
    // }

    // if (appliedFilters.length) {
    //     return filteredCustomers;
    // }
    return customers;
}

function createDummyFilterData() {
    return [
        {
            filterType: "RANGE",
            maxValue: "100",
            minValue: "0",
            name: "age",
            options: null,
        },
        {
            filterType: "RADIO",
            maxValue: null,
            minValue: null,
            name: "gender",
            options: gender
        }, 
        {

            filterType: "SELECT",
            maxValue: null,
            minValue: null,
            name: "npsScore",
            options: npsScore
        },
        {
            filterType: "RANGE",
            maxValue: "70000.0",
            minValue: "1.0",
            name: "amountSpent",
            options: null
        },
        {
            filterType: "SELECT",
            maxValue: null,
            minValue: null,
            name: "region",
            options: counties
        },
        {
            filterType: "SELECT",
            maxValue: null,
            minValue: null,
            name: "lsm",
            options: lsm
        },
        {
            filterType: "SELECT",
            maxValue: null,
            minValue: null,
            name: "employmentType",
            options: employmentType
        }, 
        {
            filterType: "SELECT",
            maxValue: null,
            minValue: null,
            name: "county",
            options: counties
        },
        {
            filterType: "SELECT",
            maxValue: null,
            minValue: null,
            name: "levelOfEducation",
            options: educationLevel
        },
        {
            filterType: "SELECT",
            maxValue: null,
            minValue: null,
            name: "banked",
            options: ['True', 'False']
        },
        {
            filterType: "SELECT",
            maxValue: null,
            minValue: null,
            name: "internetAccess",
            options: ['True', 'False']
        },
        {
            filterType: "SELECT",
            maxValue: null,
            minValue: null,
            name: "headOfHousehold",
            options: headOfHousehold
        },
        {
            filterType: "SELECT",
            maxValue: null,
            minValue: null,
            name: "cableTvSubscription",
            options: ['True', 'False']
        }
    ];
}

function createDummySegments() {
    return [
        {
            accountId: Faker.random.number(),
            count: 1200,
            countryId: 1,
            createDate: 1559007825187,
            id: '12',
            lastUpdate: 1559007937630,
            name: 'Detractors',
            queryAttribute: '[{"name": "npsScore", "options": ["DETRACTOR"], "filterType": "SELECT"}]',
            status: "ACTIVE",
        },
        {
            accountId: Faker.random.number(),
            count: 900,
            countryId: 1,
            createDate: 1559007825187,
            id: '13',
            lastUpdate: 1559007937630,
            name: 'Passives',
            queryAttribute: '[{"name": "npsScore", "options": ["PASSIVE"], "filterType": "SELECT"}]',
            status: "ACTIVE",
        },
        {
            accountId: Faker.random.number(),
            count: 14568,
            countryId: 1,
            createDate: 1559007825187,
            id: '14',
            lastUpdate: 1559007937630,
            name: 'Promoters',
            queryAttribute: '[{"name": "npsScore", "options": ["PROMOTER"], "filterType": "SELECT"}]',
            status: "ACTIVE",
        },
    ];
}

function randomDate(start, end) {
    return moment(start + Math.random() * (end.diff(start)));
}

function randomAmount(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function createFakeNPSData(selectedDateRange) {
    return {
        summary: {
          total: 100,
        },
        stats: {
          detractors: {
            value: 30,
            color: '#80c582',
          },
          passives: {
            value: 20,
            color: '#fcda6e',
          },
          promoters: {
            value: 50,
            color: '#fd9681',
          },
        },
    };
}

function createFakeSegmentSpendData (selectedDateRange, interval = 'daily') {
    let segmentSpendData = [];
    let days = 30;
    let startDate = moment.now();
    let endDate = moment().subtract(30, 'days');

    if (selectedDateRange.value !== undefined) {
        startDate = moment(selectedDateRange.value.from).startOf('day');
        endDate = moment(selectedDateRange.value.to).endOf('day');
    } else {
        startDate = moment(selectedDateRange.from).startOf('day');
        endDate = moment(selectedDateRange.to).endOf('day');
    }

    days = endDate.diff(startDate, 'days');

    for (let i = 0; i <= parseInt(days, 10); i += 1) {
        const date = moment(startDate).add(i, 'days');
        const amount = randomAmount(1000, 15000);
        segmentSpendData.push({
          period: date.format('MMM DD'), amount,
        });
    }

    return segmentSpendData.sort((a, b) => moment(a.period) - moment(b.period));
}

function createFakeGenderData() {
    const genderAggregation = [];

    gender.forEach((element) => {
        const count = randomAmount(50, 300);
        genderAggregation.push({ name: element, value: count });
    });

    return genderAggregation;
}

function createFakeAgeData() {
    const agesAggregation = [];

    ages.forEach((element) => {
        const count = randomAmount(50, 200);
        agesAggregation.push({ type: element, count });
    });

    return agesAggregation;
}

function createFakeLsmData() {
    const lsmAggregation = [];

    lsm.forEach((element) => {
        const count = randomAmount(50, 200);
        lsmAggregation.push({ type: element, count });
    });

    return lsmAggregation;
}

function createFakeLocationData() {
    const locationAggregation = [];
    counties.forEach((element) => {
        const count = randomAmount(50, 200);
        locationAggregation.push({ type: element, count });
    });

    return locationAggregation;
}

function createFakeHighestSpenders(count = 5) {
    const highestSpenders = [];

    for (let i = 0; i < count; i++) {
        highestSpenders.push(
            {
                name: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
                lastTransactionSpent: Faker.random.number({ min: 1000, max: 10000 }),
            }
        );
    }

    return highestSpenders;
}

function createDummyTransactions(count = 5, selectedDateRange) {
  const transactions = [];

  let startDate = moment.now();
  let endDate = moment().subtract(30, 'days');
  
  if (selectedDateRange.value !== undefined) {
    startDate = moment(selectedDateRange.value.from).startOf('day');
    endDate = moment(selectedDateRange.value.to).endOf('day');
  } else {
    startDate = moment(selectedDateRange.from).startOf('day');
    endDate = moment(selectedDateRange.to).endOf('day');
  }

  for(let i = 0; i < count; i++) {
    transactions.push({
      id: i,
      amountSpent: Faker.random.number({ min: 1000, max: 10000 }),
      comment: Faker.lorem.sentence(),
      lastUpdate: Faker.date.recent(),
      location: Faker.random.arrayElement(counties),
      npsScore: Faker.random.number(10),
      transactionDate: Faker.date.between(startDate, endDate)
    });
  }

  return {
    nextPageId: "*",
    previousPageId: "*",
    totalRecords: count,
    transactions: transactions.sort((a, b) => moment(b.transactionDate) - moment(a.transactionDate)),
  }
}

function createFakeNPSTRendData(selectedDateRange) {
  let NPSTrend = {};
  let days = 30;
  let startDate = moment.now();
  let endDate = moment().subtract(30, 'days');

  if (selectedDateRange.value !== undefined) {
      startDate = moment(selectedDateRange.value.from).startOf('day');
      endDate = moment(selectedDateRange.value.to).endOf('day');
  } else {
      startDate = moment(selectedDateRange.from).startOf('day');
      endDate = moment(selectedDateRange.to).endOf('day');
  }

  days = endDate.diff(startDate, 'days');

  // for(let i = startDate; i < endDate; i += 86400000) {
  //   NPSTrend[moment(i)] = {promoters: 1, passives: 0, detractors: 0}
  // }

  for(let i = 0; i < 5; i ++){
    NPSTrend[moment(Faker.date.between(startDate, endDate))] = {
      promoters: Faker.random.number(10),
      passives: 0,
      detractors: 0,
    }
  }

  return NPSTrend;
}

function createFakeCustomerSpendData(selectedDateRange) {
  let customerSpend = {};
  let days = 30;
  let startDate = moment.now();
  let endDate = moment().subtract(30, 'days');

  if (selectedDateRange.value !== undefined) {
      startDate = moment(selectedDateRange.value.from).startOf('day');
      endDate = moment(selectedDateRange.value.to).endOf('day');
  } else {
      startDate = moment(selectedDateRange.from).startOf('day');
      endDate = moment(selectedDateRange.to).endOf('day');
  }

  days = endDate.diff(startDate, 'days');

  for(let i = 0; i < 5; i ++){
    customerSpend[moment(Faker.date.between(startDate, endDate))] = Faker.random.number({ min: 1000, max: 10000});
  }

  return customerSpend;
}

function getAppliedFilter(filters, name) {
    return filters.find(filter => filter.name === name);
}

function getSegmentDetails(segmentId) {
    return createDummySegments().find((filter) => filter.id == segmentId); 
}

function getCustomerDetails(participantId) {
    return customers.find((filter) => filter.participantId == participantId);
}

export {
    createDummyCustomers,
    createDummySegments,
    createDummyFilterData,
    getSegmentDetails,
    createFakeNPSData,
    createFakeSegmentSpendData,
    createFakeGenderData,
    createFakeAgeData,
    createFakeLsmData,
    createFakeLocationData,
    createFakeHighestSpenders,
    getCustomerDetails,
    createDummyTransactions,
    createFakeNPSTRendData,
    createFakeCustomerSpendData
};