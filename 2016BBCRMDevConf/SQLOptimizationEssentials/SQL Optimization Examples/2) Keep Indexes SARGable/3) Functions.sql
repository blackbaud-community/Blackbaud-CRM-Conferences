/*
dbcc dropcleanbuffers;
dbcc freeproccache;
*/

select
	CONSTITUENT.ID
from
	dbo.CONSTITUENT
where
	datepart(YEAR, CONSTITUENT.DATEADDED) = 2014

/*
dbcc dropcleanbuffers;
dbcc freeproccache;
*/

select
	CONSTITUENT.ID
from
	dbo.CONSTITUENT
where
	CONSTITUENT.DATEADDED >= '1/1/2014' and CONSTITUENT.DATEADDED < '1/1/2015'

--declare @STARTDATE datetime = '1/1/2014';
--declare @ENDDATE datetime = '1/1/2015';
--select
--	CONSTITUENT.ID
--from
--	dbo.CONSTITUENT
--where
--	CONSTITUENT.DATEADDED >= @STARTDATE and CONSTITUENT.DATEADDED < @ENDDATE option (recompile)