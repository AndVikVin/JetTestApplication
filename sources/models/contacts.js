export const contactsCollServ = new webix.DataCollection({
	url:"http://localhost:8096/api/v1/contacts/",
	scheme:{
		$init:(obj)=>{
			obj.value = obj.FirstName + " " + obj.LastName;
		}
	}
});
