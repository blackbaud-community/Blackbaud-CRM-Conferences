/*
dbcc dropcleanbuffers;
dbcc freeproccache;

set statistics io on;
set statistics time on;
*/

--last week
exec dbo.USP_TEST_PARAMETERSNIFFING_2 @DATEFILTER = 20 --with recompile 
 
--last quarter
exec dbo.USP_TEST_PARAMETERSNIFFING_2 @DATEFILTER = 24 --with recompile