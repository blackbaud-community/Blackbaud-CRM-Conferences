using System;
using Blackbaud.UAT.Core.Base;
using Blackbaud.UAT.Core.Crm;
using Blackbaud.UAT.Base;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;
using SpecFlow.Assist.Dynamic;
using System.Collections.Generic;
using System.Linq;

[Binding]
public class IndividualConstituentSteps : BaseSteps
{
    private const string VisiblePanel = "//div[contains(@class,'bbui-pages-contentcontainer') and not(contains(@class,'x-hide-display'))]";

    [When(@"I add individual")]
    public void WhenIAddIndividual(Table Individuals)
    {
        foreach (var individual in Individuals.Rows)
        {
            individual["Last name"] = individual["Last name"] + uniqueStamp;
            BBCRMHomePage.OpenConstituentsFA();
            //ConstituentsFunctionalArea.AddAnIndividual(individual, groupCaption: "Add Records");
            //select link to add constit
            Panel.WaitClick(VisiblePanel + "//button[not(contains(@class,'bbui-pages-actiongroup-tooltip-header'))]/div[./text()='Add an individual']");
            //populate dialog
            Dialog.SetTextField("//input[contains(@id,'_LASTNAME_value')]", individual["Last name"]);
            Dialog.SetTextField("//input[contains(@id,'_FIRSTNAME_value')]", individual["First name"]);
            Dialog.SetTextField("//input[contains(@id,'_TITLECODEID_value')]", individual["Title"]);
            Dialog.SetTextField("//input[contains(@id,'_NICKNAME_value')]", individual["Nickname"]);
            Dialog.SetDropDown("//input[contains(@id,'_ADDRESS_INFOSOURCECODEID_value')]", individual["Information source"]);
            //save dialog
            Dialog.Save();
            //check the Constituents in question has been loaded
            string checkValue = individual["First name"] + " " + individual["Last name"];
            Panel.GetEnabledElement(string.Format("//h2/span[contains(./text(),'{0}')]", checkValue), 30);
        }
    }

    [When(@"I add individual with address")]
    public void WhenIAddIndividualWithAddress(Table table)
    {
        foreach (var individual in table.Rows)
        {
            individual["Last name"] = individual["Last name"] + uniqueStamp;
            BBCRMHomePage.OpenConstituentsFA();
            //ConstituentsFunctionalArea.AddAnIndividual(individual, groupCaption: "Add Records");
            //select link to add constit
            Panel.WaitClick(VisiblePanel + "//button[not(contains(@class,'bbui-pages-actiongroup-tooltip-header'))]/div[./text()='Add an individual']");
            //populate dialog
            Dialog.SetTextField("//input[contains(@id,'_LASTNAME_value')]", individual["Last name"]);
            Dialog.SetTextField("//input[contains(@id,'_FIRSTNAME_value')]", individual["First name"]);
            Dialog.SetTextField("//input[contains(@id,'_TITLECODEID_value')]", individual["Title"]);
            Dialog.SetTextField("//input[contains(@id,'_NICKNAME_value')]", individual["Nickname"]);
            Dialog.SetDropDown("//input[contains(@id,'_ADDRESS_INFOSOURCECODEID_value')]", individual["Information source"]);
            //address
            Dialog.SetTextField("//input[contains(@id,'_ADDRESS_ADDRESSTYPECODEID_value')]", individual["Address type"]);
            Dialog.SetTextField("//input[contains(@id,'_ADDRESS_COUNTRYID_value')]", individual["Country"]);
            Dialog.SetTextField("//textarea[contains(@id,'_ADDRESS_ADDRESSBLOCK_value')]", individual["Address"]);
            Dialog.SetTextField("//input[contains(@id,'_ADDRESS_CITY_value')]", individual["City"]);
            Dialog.SetTextField("//input[contains(@id,'_ADDRESS_STATEID_value')]", individual["State"]);
            Dialog.SetTextField("//input[contains(@id,'_ADDRESS_POSTCODE_value')]", individual["ZIP"]);
            //save dialog
            Dialog.Save();
            //check the Constituents in question has been loaded
            string checkValue = individual["First name"] + " " + individual["Last name"];
            Panel.GetEnabledElement(string.Format("//h2/span[contains(./text(),'{0}')]", checkValue), 15);
        }
    }

    [When(@"I move to the constituent functional area")]
    public void WhenIMoveToTheConstituentFunctionalArea()
    {
        BBCRMHomePage.OpenConstituentsFA();
    }

    [Then(@"constituent of type ""(.*)"" is created named ""(.*)""")]
    public void ThenConstituentOfTypeIsCreatedNamed(string ConstituentType, string ConstituentName)
    {
        StepHelper.SearchAndSelectConstituent(ConstituentName);
        Panel.GetEnabledElement(string.Format("//span[contains(@id,'_CONSTITUENTTYPETEXT_value') and ./text()='{0}']", ConstituentType), 15);
        Panel.GetEnabledElement(string.Format("//div[contains(@class,'bbui-pages-contentcontainer') and not(contains(@class,'x-hide-display'))]//h2[contains(@class,'bbui-pages-header')]/span[contains(./text(),'{0}')]", ConstituentName), 15);
    }

    [Then(@"constituent of type ""(.*)"" is created named ""(.*)"" with address")]
    public void ThenConstituentOfTypeIsCreatedNamedWithAddress(string ConstituentType, string ConstituentName, Table table)
    {
        //check constit
        Panel.GetEnabledElement(string.Format("//span[contains(@id,'_CONSTITUENTTYPETEXT_value') and ./text()='{0}']", ConstituentType), 15);
        Panel.GetEnabledElement(string.Format("//h2/span[contains(./text(),'{0}')]", ConstituentName + uniqueStamp), 15);
        //check address
        string addressCheck = table.Rows[0]["City"] + ", " + table.Rows[0]["State"] + "  " + table.Rows[0]["ZIP"];
        Panel.GetEnabledElement(string.Format("//div[contains(@id,'_ADDRESSROW1_value') and ./text()='{0}']", table.Rows[0]["Address"]));
        Panel.GetEnabledElement(string.Format("//div[contains(@id,'_ADDRESSROW2_value') and ./text()='{0}']", addressCheck), 15);
        //this is not displayed
        //Panel.GetEnabledElement(string.Format("//div[contains(@id,'_ADDRESSROW3_value') and ./text()='{0}']", table.Rows[0]["Country"]));
    }

    [Then(@"there is a link to ""(.*)""")]
    public void ThenThereIsALinkTo(string LinkText)
    {
        Panel.GetEnabledElement(string.Format(VisiblePanel + "//li/button/div[./text()='{0}']", LinkText), 15);
    }

    [Then(@"clicking on the link loads a dialog ""(.*)""")]
    public void ThenClickingOnTheLinkLoadsADialog(string DialogHeader)
    {
        Panel.WaitClick(string.Format(VisiblePanel + "//li/button/div[./text()='{0}']", DialogHeader));
        BaseComponent.GetEnabledElement(string.Format("//div[contains(@style,'visible')]//span[./text()='{0}']", DialogHeader), 15);
    }
}