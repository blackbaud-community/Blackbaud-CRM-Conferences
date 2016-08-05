using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public struct XpathHelper
{
    public struct xPath
    {
        public const string Button = "//button[contains(@class,'bbui-linkbutton')]//div[./text()='{0}']";
        public const string ConstituentCaption = VisibleDialog + "//label[contains(@for,'_CONSTITUENTID_value')]";
        public const string VisibleDialog = "//div[contains(@class,'x-window  bbui-dialog') and contains(@style,'visible')]";
        public const string VisiblePanel = "//div[contains(@class,'bbui-pages-contentcontainer') and not(contains(@class,'x-hide-display'))]";
    }

    public struct PaymentAddActions
    {
        public const string Payment = "Add payment";
        public const string Pledge = "Add pledge";
        public const string RecurringGift = "Add recurring gift";
        public const string Memebership = "Add Membership";
    }

    public struct PaymentEditActions
    {
        public const string Payment = "Edit payment";
        public const string Pledge = "Edit pledge";
        public const string RecurringGift = "Edit recurring gift";
        public const string OriginalAmount = "Edit original amount";
        public const string Vat = "Edit VAT";
        public const string SellProperty = "Sell property";
        public const string ViewEditSoldProperty = "View/edit sold property information";
        public const string SellStock = "Sell stock";
        public const string WriteOff = "Write-off";
    }
}