/*
dbcc dropcleanbuffers;
dbcc freeproccache;
*/

select 
	ID,
	FIRSTNAME,
	KEYNAME,
	LOOKUPID 
from 
	dbo.CONSTITUENT
where
	CONSTITUENT.KEYNAME like '%Hendershot%'

/*
dbcc dropcleanbuffers;
dbcc freeproccache;
*/

select 
	ID,
	FIRSTNAME,
	KEYNAME,
	LOOKUPID 
from 
	dbo.CONSTITUENT
where
	CONSTITUENT.KEYNAME like 'Hendershot%'