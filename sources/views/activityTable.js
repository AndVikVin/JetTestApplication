import {JetView} from "webix-jet";
import {activityType, activities} from "../models/activities";
import PopupWin from "./popupWin";


class ActivityTable extends JetView {
	config(){
		const _ = this.app.getService("locale")._;
		return{
			view:"datatable",
			localId:"activityTable",
			columns:[
				{id:"State",header:"", template:"{common.checkbox()}", checkValue:"Open", unCheckValue:"Close"},
				{id:"TypeID",header:[_("Activity Type"), {content:"richSelectFilter"}], collection:activityType, sort:"string",fillspace:true},
				{id:"DueDate",header:[_("Due Date"),{content:"datepickerFilter", inputConfig:{ timepicker:true }}], format:webix.Date.dateToStr("%d-%m-%Y %H:%i"), sort:"date",fillspace:true},
				{id:"Details",header:[_("Details"),{content:"textFilter"}], sort:"string",fillspace:true},
				{id:"edit",header:"",template:"{common.editIcon()}"},
				{id:"trash",header:"",template:"{common.trashIcon()}"}
			],
			onClick:{
				"wxi-trash":function(e,id){
					webix.confirm({
						title:_("Delete activity"),
						ok:_("Yes"),
						cancel:_("No"),
						text:_("Are you shure you whant to delete activity?"),
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
		this.PopupWin= this.ui(PopupWin);
	}
	urlChange(){
		const id = this.getParam("id");
		activities.filter((obj)=>{
			return obj.ContactID == id;
		});
	}
}

export default ActivityTable;
