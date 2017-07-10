declare @DATAFORMPROCEDURENAME nvarchar(1024) = 'USP_DATAFORM_LOAD_0c836902_a398_47a0_91eb_8b66e434148e';
declare @DATAFORMINSTANCEID uniqueidentifier = replace(right(@DATAFORMPROCEDURENAME, 36), '_', '-');

select 
	* 
from
	dbo.DATAFORMINSTANCECATALOG
where ID = @DATAFORMINSTANCEID

select * from dbo.PAGEDEFINITIONCATALOG where cast(PAGEDEFINITIONSPEC as nvarchar(max)) like '%' + cast(@DATAFORMINSTANCEID as nvarchar(36)) + '%'