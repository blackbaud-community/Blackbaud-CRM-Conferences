Feature: IndividualConstituent
	In order to record information about alumni and supporters
	As a BBCRM user
	I want to add a new Individual constituent to the database

#Basic test to demo login and a bit of navigation
@aaa_Demo
@IndividualConstituent
Scenario: Check the ability to add new Individual Constituent record
	Given I have logged into the BBCRM home page
	When I move to the constituent functional area
	Then there is a link to "Add an individual"
	And clicking on the link loads a dialog "Add an individual"

#A bit more advanced - let see how we load a form and set data in it,save it and verify the data was saved
@aaa_Demo
@IndividualConstituent
Scenario: Add a new Individual Constituent record
	Given I have logged into the BBCRM home page
	When I add individual
	| Last name | First name | Title | Nickname | Information source |
	| Prospect  | Bob        | Mr.   | Bobby    | Other              |
	Then constituent of type "Individual" is created named "Bob Prospect"

#Little more advanced again - lets deal with looping (Demo)
@aaa_Demo
@IndividualConstituent
Scenario: Add multiple new Individual Constituent records
	Given I have logged into the BBCRM home page
	When I add individual
	| Last name | First name | Title | Nickname | Information source |
	| Prospect  | Bob        | Mr.   | Bobby    | Other              |
	| Prospect  | William    | Mr.   | Billy    | Other              |
	Then constituent of type "Individual" is created named "Bob Prospect"
	And constituent of type "Individual" is created named "William Prospect"

#Little more advanced again - lets deal with looping
@aaa_Demo
@IndividualConstituent
Scenario: Add Individual Constituent record with address
	Given I have logged into the BBCRM home page
	When I add individual with address
	| Last name | First name | Title | Nickname | Information source | Address type | Country       | Address | City     | State | ZIP   |
	| Prospect  | William    | Mr.   | Billy    | Other              | Home         | United States | Test    | SomeCity | PA    | 19147 |
	Then constituent of type "Individual" is created named "William Prospect" with address
	| Address type | Address | City     | State | ZIP   | Country       |
	| Home - Main  | Test    | SomeCity | PA    | 19147 | United States |