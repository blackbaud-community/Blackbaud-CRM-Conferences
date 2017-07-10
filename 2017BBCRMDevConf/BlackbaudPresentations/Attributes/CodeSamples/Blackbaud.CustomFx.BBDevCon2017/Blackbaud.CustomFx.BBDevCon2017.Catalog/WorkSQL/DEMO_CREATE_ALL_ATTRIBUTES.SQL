-----------------------------------------------------------------------------------------------------------------------------------------------
--**********************Create any attributes that need to be created.
-----------------------------------------------------------------------------------------------------------------------------------------------
DECLARE @ATTRIBUTESTOCREATE TABLE
(
    ID uniqueidentifier
   ,NAME nvarchar(60)
   ,ATTRIBUTERECORDTYPENAME nvarchar(100)
   ,DATATYPECODE tinyint
   ,CODETABLECATALOGID uniqueidentifier
   ,ONLYALLOWONEPERRECORD BIT
   ,ATTRIBUTEGROUPNAME nvarchar(60)
   ,CONSTITUENTSEARCHLISTCATALOGID uniqueidentifier
   ,ISLISTBUILDERATTRIBUTE bit
)

----      <EnumValues>
----        <EnumValue ID="0" Translation="Text" />
----        <EnumValue ID="1" Translation="Number" />
----        <EnumValue ID="2" Translation="Date" />
----        <EnumValue ID="3" Translation="Currency" />
----        <EnumValue ID="4" Translation="Yes/No" />
----        <EnumValue ID="5" Translation="Code table" />
----        <EnumValue ID="6" Translation="Constituent record" />
----        <EnumValue ID="7" Translation="Fuzzy date" />
----        <EnumValue ID="8" Translation="Time" />
----        <EnumValue ID="9" Translation="Memo" />
----      </EnumValues>
----    </EnumField>


	
	

DECLARE @NOCONSTITUENTSEARCHLISTCATALOGID UNIQUEIDENTIFIER = null  -----if needed set this and use appropriately
DECLARE @CONSTITUENTSEARCHLISTCATALOGID UNIQUEIDENTIFIER = null  -----if needed set this and use appropriately



-----------------------------------------------------------------------------------------------------------------------------------------------
---------INSERT ROWS INTO THIS TABLE FOR EACH ATTRIBUTE THAT WE WANT TO CREATE.  The Following cursor will handle the rest.--------------------
-----------------------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------------

insert into @ATTRIBUTESTOCREATE (ID, NAME, ATTRIBUTERECORDTYPENAME, DATATYPECODE, CODETABLECATALOGID, ONLYALLOWONEPERRECORD, ATTRIBUTEGROUPNAME, CONSTITUENTSEARCHLISTCATALOGID, ISLISTBUILDERATTRIBUTE)
      select newid(), 'Demo1Text', 'Constituent',0, null, 1, '', @NOCONSTITUENTSEARCHLISTCATALOGID, 0
union select newid(), 'Demo1Date', 'Constituent',2, null, 1, '', @NOCONSTITUENTSEARCHLISTCATALOGID, 0
union select 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA', 'Demo2Text', 'Constituent',0, null, 1, '', @NOCONSTITUENTSEARCHLISTCATALOGID, 0
union select 'BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB', 'Demo2Date', 'Constituent',2, null, 1, '', @NOCONSTITUENTSEARCHLISTCATALOGID, 0
union select newid(), 'Demo3Text', 'Constituent',0, null, 1, '', @NOCONSTITUENTSEARCHLISTCATALOGID, 0
union select newid(), 'Demo3Date', 'Constituent',2, null, 1, '', @NOCONSTITUENTSEARCHLISTCATALOGID, 0
---union select '', 'Post to FI', 'Revenue',5, 'f6cf59ef-a782-46c2-a684-76c87de321f5', 0, '', @NOCONSTITUENTSEARCHLISTCATALOGID, 0
---union select '878C67A7-8FF5-45E0-AB4D-C066B5A9B38A', 'Privately Held Securities', 'Revenue',5, '21254D5C-2DD9-4157-8956-96CDA315FCD1', 0, '', @NOCONSTITUENTSEARCHLISTCATALOGID, 0
---union select '0EF2658B-4ACB-4178-A618-4DAC606D358A', 'Associates Gift', 'Revenue',5, '53F2F2BA-CB06-4B17-91BE-27B3621FB6C3', 0, '', @NOCONSTITUENTSEARCHLISTCATALOGID, 0


-----------------------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------------

DECLARE @CURRENTDATE2 DATETIME = getdate()
DECLARE @CHANGEAGENTID2 UNIQUEIDENTIFIER
IF @CHANGEAGENTID2 IS NULL    
	exec dbo.USP_CHANGEAGENT_GETORCREATECHANGEAGENT @CHANGEAGENTID2 output


DECLARE @THEID uniqueidentifier
DECLARE @ATTRIBUTERECORDTYPEID UNIQUEIDENTIFIER
DECLARE @ATTRIBUTEGROUPCODEID UNIQUEIDENTIFIER
DECLARE @DATATYPECODE TINYINT
DECLARE @NAME NVARCHAR(60)
DECLARE @ONLYALLOWONEPERRECORD BIT
DECLARE @CODETABLECATALOGID UNIQUEIDENTIFIER = null
DECLARE @ATTRIBUTERECORDTYPENAME nvarchar(100)
DECLARE @ATTRIBUTEGROUPNAME nvarchar(100)

DECLARE attribute_cursor CURSOR FOR  
SELECT ID, NAME, ATTRIBUTERECORDTYPENAME, DATATYPECODE, CODETABLECATALOGID, ONLYALLOWONEPERRECORD, ATTRIBUTEGROUPNAME, CONSTITUENTSEARCHLISTCATALOGID
FROM @ATTRIBUTESTOCREATE

OPEN attribute_cursor  
FETCH NEXT FROM attribute_cursor INTO @THEID, @NAME, @ATTRIBUTERECORDTYPENAME, @DATATYPECODE, @CODETABLECATALOGID, @ONLYALLOWONEPERRECORD, @ATTRIBUTEGROUPNAME, @CONSTITUENTSEARCHLISTCATALOGID

WHILE @@FETCH_STATUS = 0  
BEGIN


    ---Get the Correct Attribute Record Type
    SET @ATTRIBUTERECORDTYPEID = (SELECT ART.ID FROM ATTRIBUTERECORDTYPE ART JOIN RECORDTYPE RT ON RT.ID = ART.RECORDTYPEID WHERE RT.NAME = @ATTRIBUTERECORDTYPENAME)

    ---Get Or Create the Attribute Group
    if @ATTRIBUTEGROUPNAME <> ''
    begin
        if not exists (select 'x' from ATTRIBUTEGROUPCODE where DESCRIPTION = @ATTRIBUTEGROUPNAME)
        begin
            declare @AGC_SEQ integer = 1
            set @AGC_SEQ = (select isnull(max(sequence+1),1) from ATTRIBUTEGROUPCODE)
            set @ATTRIBUTEGROUPCODEID = newid()
            insert into ATTRIBUTEGROUPCODE (ID, DESCRIPTION, ACTIVE, SEQUENCE, ADDEDBYID, CHANGEDBYID, DATEADDED, DATECHANGED)
            values (@ATTRIBUTEGROUPCODEID, @ATTRIBUTEGROUPNAME, 1, @AGC_SEQ, @CHANGEAGENTID2, @CHANGEAGENTID2, @CURRENTDATE2, @CURRENTDATE2)
        end
        else
        begin
            set @ATTRIBUTEGROUPCODEID = (SELECT ID FROM ATTRIBUTEGROUPCODE AGC WHERE AGC.DESCRIPTION = @ATTRIBUTEGROUPNAME)
        end        
    end
    else
    begin
        set @ATTRIBUTEGROUPCODEID = null
    end

    IF NOT EXISTS(SELECT 1 FROM ATTRIBUTECATEGORY WHERE NAME = @NAME AND ATTRIBUTERECORDTYPEID = @ATTRIBUTERECORDTYPEID)
	BEGIN
		execute dbo.USP_DATAFORMTEMPLATE_ADD_ATTRIBUTECATEGORY @THEID, 
															   @CHANGEAGENTID2, 
															   @ATTRIBUTERECORDTYPEID, 
															   @DATATYPECODE, 
															   @NAME, 
															   @ONLYALLOWONEPERRECORD,
															   @CODETABLECATALOGID, 
															   @CONSTITUENTSEARCHLISTCATALOGID, 
															   @ATTRIBUTEGROUPCODEID
	END

   FETCH NEXT FROM attribute_cursor INTO @THEID, @NAME, @ATTRIBUTERECORDTYPENAME, @DATATYPECODE, @CODETABLECATALOGID, @ONLYALLOWONEPERRECORD, @ATTRIBUTEGROUPNAME, @CONSTITUENTSEARCHLISTCATALOGID
END  

CLOSE attribute_cursor  
DEALLOCATE attribute_cursor 


