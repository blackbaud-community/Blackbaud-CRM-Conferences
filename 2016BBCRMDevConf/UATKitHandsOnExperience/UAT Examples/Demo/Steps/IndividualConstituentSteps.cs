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

    #region "Blue peter code"

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
            Panel.GetEnabledElement(string.Format("//h2/span[contains(./text(),'{0}')]", checkValue), 60);
        }
    }

    [Then(@"constituent of type ""(.*)"" is created named ""(.*)""")]
    public void ThenConstituentOfTypeIsCreatedNamed(string ConstituentType, string ConstituentName)
    {
        StepHelper.SearchAndSelectConstituent(ConstituentName);
        Panel.GetEnabledElement(string.Format("//span[contains(@id,'_CONSTITUENTTYPETEXT_value') and ./text()='{0}']", ConstituentType), 15);
        Panel.GetEnabledElement(string.Format(VisiblePanel + "//h2[contains(@class,'bbui-pages-header')]/span[contains(./text(),'{0}')]", ConstituentName), 15);
    }

    #endregion

}