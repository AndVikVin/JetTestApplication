const activities = new webix.DataCollection({
	url:"http://localhost:8096/api/v1/activities/",
	save:"rest->http://localhost:8096/api/v1/activities/",
	scheme:{
		$init:(obj)=>{
			const dateFormat =  webix.Date.strToDate("%d-%m-%Y %H:%i");
			obj.DueDate = dateFormat(obj.DueDate);
		},
		$save:(obj)=>{
			const dateFormat =  webix.Date.strToDate("%d-%m-%Y %H:%i");
			obj.DueDate = dateFormat(obj.DueDate);
		},
		$change:(obj)=>{
			const dateFormat =  webix.Date.strToDate("%d-%m-%Y %H:%i");
			obj.DueDate = dateFormat(obj.DueDate);
		}
	}
});

const activityType = new webix.DataCollection({
	url:"http://localhost:8096/api/v1/activitytypes/",
	scheme:{
		$init:(obj)=>{
			obj.value = obj.Value;
		}
	}
});

export {activities, activityType};
