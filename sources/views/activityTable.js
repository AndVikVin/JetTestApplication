import {JetView} from "webix-jet";
import {activityType, activities} from "../models/activities";


class ActivityTable extends JetView {
	config(){
		return{
			view:"datatable",
			localId:"activityTable",
			columns:[
				{id:"State",header:"", template:"{common.checkbox()}", checkValue:"Open", unCheckValue:"Close"},
				{id:"TypeID",header:["Activity Type", {content:"selectFilter"}], adjust:"data", collection:activityType, sort:"string",fillspace:true},
				{id:"DueDate",header:["Due Date",{content:"datepickerFilter", inputConfig:{ timepicker:true }}], adjust:"data",format:webix.Date.dateToStr("%d-%m-%Y %H:%i"), sort:"date",fillspace:true},
				{id:"Details",header:["Details",{content:"textFilter"}], adjust:"data", sort:"string",fillspace:true},
				{id:"edit",header:"",template:"{common.editIcon()}"},
				{id:"trash",header:"",template:"{common.trashIcon()}"}
			],
			onClick:{
				"wxi-trash":function(e,id){
					webix.confirm({
						title:"Delete activity",
						ok:"Yes",
						cancel:"No",
						text:"Are you shure you whant to delete activity?",
						type:"confirm-warning",
						callback:(result)=>{
							if(result === true){
								activities.remove(id);
								return false;
							}
						}
					});
					return false;
				},
				"wxi-pencil":(e,id)=>{
					const obj = activities.getItem(id);
					this.PopupWin.showPopup(obj, "Edit");
				}
			}
		};
	}
	init(){
		this.$$("activityTable").sync(activities);
	}
	urlChange(){
		const id = this.getParam("id");
		activities.filter((obj)=>{
			return obj.ContactID == id;
		});
	}

}

export default ActivityTable;
