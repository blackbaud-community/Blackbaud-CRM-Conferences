/*
dbcc dropcleanbuffers;
dbcc freeproccache;
*/

exec dbo.USP_TEST_PARAMETERSNIFFING @KEYNAME = 'Hendershot%' --with recompile

exec dbo.USP_TEST_PARAMETERSNIFFING @KEYNAME = 'H%' --with recompile
