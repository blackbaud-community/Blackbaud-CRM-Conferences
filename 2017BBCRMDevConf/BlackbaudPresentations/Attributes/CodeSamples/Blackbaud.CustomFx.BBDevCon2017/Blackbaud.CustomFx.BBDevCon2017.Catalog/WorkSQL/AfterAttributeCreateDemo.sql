--all objects created within last 5 mins
select type_desc, count(*) 
from sys.objects
where create_date > dateadd(mi,-5, getdate()) 
group by type_desc

---this is where attribute metadata is stored
select * from dbo.ATTRIBUTECATEGORY

---yes we have a table catalog
select * from TABLECATALOG where DATEADDED > DATEADD(mi,-5,getdate())

---yes we have batch type extensions
select * from BATCHTYPEEXTENSIONCATALOG where DATEADDED > DATEADD(mi,-5,getdate())