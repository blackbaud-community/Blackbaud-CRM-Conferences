/*
drop procedure dbo.USP_TEST_PARAMETERSNIFFING
*/

create procedure dbo.USP_TEST_PARAMETERSNIFFING(
	@KEYNAME as nvarchar(255)
)
as
	set nocount on;

	select
		ID,
		FIRSTNAME,
		KEYNAME,
		GENDER
	from 
		dbo.CONSTITUENT
	where	
		CONSTITUENT.KEYNAME like @KEYNAME
	
go

/*
drop procedure dbo.USP_TEST_PARAMETERSNIFFING_2
*/


create procedure dbo.USP_TEST_PARAMETERSNIFFING_2(
	@DATEFILTER tinyint = 0
)
as
	set nocount on;

	declare @STARTDATE datetime;
	declare @ENDDATE datetime;

	exec dbo.USP_RESOLVEDATEFILTER @DATEFILTER, @STARTDATE output, @ENDDATE output;

	select
		ID,
		CONSTITUENTID,
		BASEAMOUNT,
		TYPECODE
	from 
		dbo.FINANCIALTRANSACTION
	where
		FINANCIALTRANSACTION.DATE >= @STARTDATE and FINANCIALTRANSACTION.DATE <= @ENDDATE
	--option (recompile)

go