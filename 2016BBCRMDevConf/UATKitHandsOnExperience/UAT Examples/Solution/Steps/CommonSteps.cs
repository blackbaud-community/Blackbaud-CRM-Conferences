using Blackbaud.UAT.Core.Base;
using Blackbaud.UAT.Core.Bbis.Pages;
using Blackbaud.UAT.Core.Crm;
using Blackbaud.UAT.SpecFlow.Selenium;
using TechTalk.SpecFlow;

[Binding]
public class CommonSteps : BaseSteps
{
    [Given(@"I have logged into the BBCRM home page")]
    [When(@"I have logged into the BBCRM home page")]
    public void GivenIHaveLoggedIntoTheBBCRMHomePage()
    {
        BBCRMHomePage.Login();
    }

    [Given(@"I have logged into the BBCRM home page as user ""(.*)""")]
    public void GivenIHaveLoggedIntoTheBBCRMHomePageAsUser(string Credentials)
    {
        // credentials should be in form "user:password"
        BaseTest.NewSession();
        BBCRMHomePage.LoginAs(Credentials);
    }
}