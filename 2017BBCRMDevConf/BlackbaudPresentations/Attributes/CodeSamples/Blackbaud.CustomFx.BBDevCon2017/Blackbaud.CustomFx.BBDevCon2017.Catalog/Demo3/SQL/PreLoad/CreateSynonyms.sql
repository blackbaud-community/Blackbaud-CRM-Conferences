declare @SYNONYMPREFIX nvarchar(10) = 'USR_SYN_'

declare @synonymstoadd table
(
     SYNONYMNAME nvarchar(200)
	,TABLENAME nvarchar(200)
	,ISPROCESSED bit
)


insert into @synonymstoadd (SYNONYMNAME, TABLENAME, ISPROCESSED)
select UPPER(@SYNONYMPREFIX + REPLACE(RT.NAME,' ','')+'_'+ REPLACE(AC.NAME,' ','')), TC.TABLENAME, 0
from dbo.ATTRIBUTECATEGORY AC
     inner join dbo.ATTRIBUTERECORDTYPE ART on AC.ATTRIBUTERECORDTYPEID = ART.ID
     inner join dbo.RECORDTYPE RT on ART.RECORDTYPEID = RT.ID
     inner join dbo.TABLECATALOG TC on AC.TABLECATALOGID = TC.ID


declare @C_SYNONYMNAME nvarchar(200)
declare @C_TABLENAME nvarchar(200)

select top 1 @C_SYNONYMNAME=SYNONYMNAME, @C_TABLENAME=TABLENAME from @synonymstoadd where ISPROCESSED = 0
while @C_SYNONYMNAME is not null
begin

    if exists (select top 1 1 from sys.all_objects where name = @C_SYNONYMNAME and type_desc = 'SYNONYM')
    begin
        exec('drop synonym ' + @C_SYNONYMNAME);
        print 'DROPPPED SYNONYM '+ @C_SYNONYMNAME
    end

    exec('CREATE SYNONYM '+ @C_SYNONYMNAME + ' FOR ' + @C_TABLENAME)
    print 'CREATED SYNONYM '+ @C_SYNONYMNAME + ' FOR ' + @C_TABLENAME
    
    update @synonymstoadd set ISPROCESSED=1 where SYNONYMNAME=@C_SYNONYMNAME
    set @C_SYNONYMNAME = null
    set @C_TABLENAME = null
    select top 1 @C_SYNONYMNAME=SYNONYMNAME, @C_TABLENAME=TABLENAME from @synonymstoadd where ISPROCESSED = 0
end

















