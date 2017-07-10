select * from dbo.ADHOCQUERY
where
	cast(QUERYDEFINITIONXML as nvarchar(max)) like '%7994191c-0254-4dc2-a394-3936ad8cf298%'
	and cast(QUERYDEFINITIONXML as nvarchar(max)) like '%a9f9ffbb-5086-486e-a487-0db32ec9f104%'