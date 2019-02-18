const dateFormatSave =  webix.Date.dateToStr("%Y-%m-%d %H:%i");
const dateFormatInit =  webix.Date.strToDate("%d-%m-%Y %H:%i");

const activities = new webix.DataCollection({
	url:"http://localhost:8096/api/v1/activities/",
	save:"rest->http://localhost:8096/api/v1/activities/",
	scheme:{
		$init:(obj)=>{
			if(typeof(obj.DueDate) === "string")
				obj.DueDate = dateFormatInit(obj.DueDate);
				// console.log(obj)
		},
		$save:(obj)=>{
			if (typeof(obj.DueDate) === "object"){
				obj.DueDate = dateFormatSave(obj.DueDate);
			}
		},
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
