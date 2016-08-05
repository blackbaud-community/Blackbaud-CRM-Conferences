/*
drop procedure dbo.USP_TEST_NOTDYNAMICSQL
*/


create procedure dbo.USP_TEST_NOTDYNAMICSQL(
	@CONSTITUENTID as uniqueidentifier = null,
	@STARTDATE as datetime = null,
	@ENDDATE as datetime = null
)
as
	set nocount on;

	select
		ID,
		CONSTITUENTID,
		TYPECODE,
		TRANSACTIONAMOUNT
	from 
		dbo.FINANCIALTRANSACTION
	where	
		(FINANCIALTRANSACTION.CONSTITUENTID = @CONSTITUENTID or @CONSTITUENTID is null)
		and (FINANCIALTRANSACTION.DATE >= @STARTDATE or @STARTDATE is null)
		and (FINANCIALTRANSACTION.DATE <= @ENDDATE or @ENDDATE is null)

go
/*
drop procedure dbo.USP_TEST_DYNAMICSQL
*/


create procedure dbo.USP_TEST_DYNAMICSQL(
	@CONSTITUENTID as uniqueidentifier = null,
	@STARTDATE as datetime = null,
	@ENDDATE as datetime = null
)
as
	set nocount on;

	declare @SQL as nvarchar(max) = '
	select
		ID,
		CONSTITUENTID,
		TYPECODE,
		TRANSACTIONAMOUNT
	from 
		dbo.FINANCIALTRANSACTION 
	'
	
	declare @WHERECLAUSE nvarchar(max);
	
	if @CONSTITUENTID is not null
		set @WHERECLAUSE = 'where FINANCIALTRANSACTION.CONSTITUENTID = @CONSTITUENTID '
	
	if @STARTDATE is not null
	begin
		if @WHERECLAUSE is null
			set @WHERECLAUSE = 'where '
		else
			set @WHERECLAUSE = @WHERECLAUSE + 'and '
			
		set @WHERECLAUSE = @WHERECLAUSE + 'FINANCIALTRANSACTION.DATE >= @STARTDATE ' 
	end
	
	if @STARTDATE is not null
	begin
		if @WHERECLAUSE is null
			set @WHERECLAUSE = 'where '
		else
			set @WHERECLAUSE = @WHERECLAUSE + 'and '
			
		set @WHERECLAUSE = @WHERECLAUSE + 'FINANCIALTRANSACTION.DATE < @ENDDATE ' 
	end
	
	set @SQL = @SQL + @WHERECLAUSE;
	
	exec sp_executesql @SQL, N'@CONSTITUENTID uniqueidentifier, @STARTDATE datetime, @ENDDATE datetime', @CONSTITUENTID=@CONSTITUENTID, @STARTDATE=@STARTDATE, @ENDDATE=@ENDDATE;
	