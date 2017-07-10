declare @DATAFORMINSTANCEID uniqueidentifier;

select * from dbo.DATAFORMTEMPLATECATALOG where TEMPLATENAME = 'Constituent Summary Tile Panel View Form'
select @DATAFORMINSTANCEID = ID from dbo.DATAFORMINSTANCECATALOG where FORMNAME = 'Constituent Summary Tile Panel View Form'
select * from dbo.PAGEDEFINITIONCATALOG where cast(PAGEDEFINITIONSPEC as nvarchar(max)) like '%' + cast(@DATAFORMINSTANCEID as nvarchar(36)) + '%'