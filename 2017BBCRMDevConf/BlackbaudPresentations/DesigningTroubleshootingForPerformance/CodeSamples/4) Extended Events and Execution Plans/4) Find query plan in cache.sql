SELECT cp.objtype AS PlanType,
OBJECT_NAME(st.objectid,st.dbid) AS ObjectName,
cp.refcounts AS ReferenceCounts,
cp.usecounts AS UseCounts,
st.TEXT AS SQLBatch,
qp.query_plan AS QueryPlan
FROM sys.dm_exec_cached_plans AS cp
CROSS APPLY sys.dm_exec_query_plan(cp.plan_handle) AS qp
CROSS APPLY sys.dm_exec_sql_text(cp.plan_handle) AS st
where 
	-- By text in query
	convert(nvarchar(max), query_plan) like '%7994191c-0254-4dc2-a394-3936ad8cf298%'

SELECT cp.objtype AS PlanType,
OBJECT_NAME(st.objectid,st.dbid) AS ObjectName,
cp.refcounts AS ReferenceCounts,
cp.usecounts AS UseCounts,
st.TEXT AS SQLBatch,
qp.query_plan AS QueryPlan
FROM sys.dm_exec_cached_plans AS cp
CROSS APPLY sys.dm_exec_query_plan(cp.plan_handle) AS qp
CROSS APPLY sys.dm_exec_sql_text(cp.plan_handle) AS st
where 
	--By object name
	OBJECT_NAME(st.objectid,st.dbid) like 'USP_DATALIST_CONSTITUENTCORRESPONDENCERECENT%'