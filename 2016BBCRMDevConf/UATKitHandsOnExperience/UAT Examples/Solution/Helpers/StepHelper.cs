using System;
using System.Collections.Generic;
using Blackbaud.UAT.Base;
using Blackbaud.UAT.Core.Base;
using Blackbaud.UAT.Core.Crm;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
//using Oxford.UAT.Crm;
using TechTalk.SpecFlow;
using System.Configuration;
using System.Globalization;
using System.Threading;
using TechTalk.SpecFlow.Assist;
//using SpecFlow.Assist.Dynamic;

public class StepHelper : BaseSteps
{
    private struct LowerCase
    {
        public const string Today = "today";
        public const string Day = " day";
        public const string Days = " days";
        public const string Week = "week";
        public const string Weeks = "weeks";
        public const string Month = "month";
        public const string Months = "months";
        public const string Year = "year";
        public const string Years = "years";
    }
    private const string plus = "+";
    private const string minus = "-";

    private enum TimePeriod
    {
        Day = 0,
        Week = 1,
        Month = 2,
        Year = 3,
        NotSet = 99
    }

    public static void SearchAndSelectConstituent(string ConstituentName)
    {
        bool splitName = false;
        if (ConstituentName.IndexOf(" ") > 0)
        {
            splitName = true;
        }
        SearchAndSelectConstituent(ConstituentName, splitName);
    }

    public static void SearchAndSelectConstituent(string ConstituentName, bool SplitName)
    {
        BBCRMHomePage.OpenConstituentsFA();
        ConstituentsFunctionalArea.OpenConstituentSearchDialog();

        if (SplitName)
        {
            var names = new string[2];
            names = ConstituentName.Split(' ');
            SearchDialog.SetFirstNameToSearch(names[0]);
            SearchDialog.SetLastNameToSearch(names[1] + uniqueStamp);
        }
        else
        {
            SearchDialog.SetLastNameToSearch(ConstituentName + uniqueStamp);
        }
        SearchDialog.Search();
        SearchDialog.SelectFirstResult();
    }

    public static void SetAccountSystem(string AccountSystem)
    {
        BaseComponent.WaitClick("//a[contains(@id,'_SHOWSYSTEM_action')]"); //select correct account system
        BaseComponent.GetEnabledElement("//div[contains(@class, ' x-window  bbui-dialog') and contains(@style,'visible')]//span[./text()='Select an account system']");
        IDictionary<string, CrmField> Supportedfields = new Dictionary<string, CrmField>
            {
                {"Account System", new CrmField("_PDACCOUNTSYSTEMID_value", FieldType.Dropdown)}
            };
        Dialog.SetField("SelectAccountSystem", "Account System", AccountSystem, Supportedfields);
        //OK button
        BaseComponent.WaitClick("//div[contains(@class, 'x-window  bbui-dialog') and contains(@style,'visible')]//button[./text()='OK']");
    }

    public static void SetBenefit(string BenefitName, bool IsPledge)
    {
        //setup
        var caption = "Benefit";
        var dialogId = "BenefitDetails";
        var gridId = "_BENEFITS_value";
        IDictionary<string, int> columnCaptionToIndex = new Dictionary<string, int>();
        BenefitName += uniqueStamp;

        //click button for pop up
        if (IsPledge)
        {
            BaseComponent.WaitClick("//a[contains(@id,'_EDITBENEFITSACTION_action')]");
        }
        else
        {
            BaseComponent.WaitClick("//div[contains(@id,'EDITBENEFITSACTION_action')]//button");
        }

        //add benfitname to grid
        columnCaptionToIndex.Add(caption,
            BaseComponent.GetDatalistColumnIndex(Dialog.getXGridHeaders(dialogId, gridId), caption));
        string gridXPath = Dialog.getXGridCell(dialogId, gridId, 1, columnCaptionToIndex[caption]);
        string gridRowXPath = Dialog.getXGridRow(dialogId, gridId, 1);
        Dialog.SetGridTextField(gridXPath, BenefitName);

        //click OK
        BaseComponent.WaitClick(
            "//div[contains(@class, 'x-window  bbui-dialog') and contains(@style,'visible')]//button[./text()='OK']");
    }

    public static void SetCurrentThreadCultureToConfigValue()
    {
        //lets set the thread culture to get the correct date for the browser
        Thread.CurrentThread.CurrentCulture = new CultureInfo(ConfigurationManager.AppSettings["ChromeDriver.language"]);
    }

    public static int DateIncrementAfterPlus(string DateString)
    {
        return Convert.ToInt32(DateString.Substring(DateString.IndexOf(plus) + 1, 1));
    }

    public static int DateIncrementAfterMinus(string DateString)
    {
        return -1 * Convert.ToInt32(DateString.Substring(DateString.IndexOf(minus) + 1, 1));
    }

    public static void SetTodayDateInTableRow(string CaptionKey, TableRow tableRow)
    {
        TimePeriod timePeriodToAdd = TimePeriod.NotSet;
        int i = 0;

        //set thread to correct culture
        SetCurrentThreadCultureToConfigValue();
        if (tableRow.ContainsKey(CaptionKey) &&
            !string.IsNullOrEmpty(tableRow[CaptionKey]) &&
            tableRow[CaptionKey].ToLower().Contains(LowerCase.Today))
        {

            //get number to increase
            if (tableRow[CaptionKey].Contains(plus))
            {
                i = DateIncrementAfterPlus(tableRow[CaptionKey]);
            }
            else if (tableRow[CaptionKey].Contains(minus))
            {
                i = DateIncrementAfterMinus(tableRow[CaptionKey]);
            }

            //get time unit to increase
            if (tableRow[CaptionKey].ToLower().Contains(LowerCase.Day) || tableRow[CaptionKey].ToLower().Contains(LowerCase.Days)) timePeriodToAdd = TimePeriod.Day;
            if (tableRow[CaptionKey].ToLower().Contains(LowerCase.Week) || tableRow[CaptionKey].ToLower().Contains(LowerCase.Weeks)) timePeriodToAdd = TimePeriod.Week;
            if (tableRow[CaptionKey].ToLower().Contains(LowerCase.Month) || tableRow[CaptionKey].ToLower().Contains(LowerCase.Months)) timePeriodToAdd = TimePeriod.Month;
            if (tableRow[CaptionKey].ToLower().Contains(LowerCase.Year) || tableRow[CaptionKey].ToLower().Contains(LowerCase.Years)) timePeriodToAdd = TimePeriod.Year;

            //actually increase
            switch (timePeriodToAdd)
            {
                case TimePeriod.Day:
                    tableRow[CaptionKey] = DateTime.Now.AddDays(i).ToShortDateString();
                    break;
                case TimePeriod.Week:
                    tableRow[CaptionKey] = DateTime.Now.AddDays(i * 7).ToShortDateString();
                    break;
                case TimePeriod.Month:
                    tableRow[CaptionKey] = DateTime.Now.AddMonths(i).ToShortDateString();
                    break;
                case TimePeriod.Year:
                    tableRow[CaptionKey] = DateTime.Now.AddYears(i).ToShortDateString();
                    break;
                case TimePeriod.NotSet:
                    //handle nothing to add
                    tableRow[CaptionKey] = DateTime.Now.ToShortDateString();
                    break;
            }
        }
    }

    public static void SetTodayDateInTableRow(string CaptionKey, Table table)
    {
        foreach (TableRow tableRow in table.Rows)
        {
            SetTodayDateInTableRow(CaptionKey, tableRow);
        }
    }
}