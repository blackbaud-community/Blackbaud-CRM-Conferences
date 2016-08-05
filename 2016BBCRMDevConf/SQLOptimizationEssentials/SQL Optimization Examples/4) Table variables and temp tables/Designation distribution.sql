select
	avg(DESIGNATIONCOUNT)
from (
	select
		count(*) DESIGNATIONCOUNT
	from
		dbo.REVENUESPLIT_EXT
	group by
		DESIGNATIONID) TOTALS

		