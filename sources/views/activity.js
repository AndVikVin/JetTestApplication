import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import {activities, activityType} from "../models/activities";
import PopupWin from "./popupWin";

class ActivityTable extends JetView{
	config(){
		const _ = this.app.getService("locale")._;
		const activityTable = {
			view:"datatable",
			localId:"activityTable",
			columns:[
				{id:"State",header:"", template:"{common.checkbox()}", checkValue:"Close", unCheckValue:"Open"},
				{id:"TypeID",header:[_("Activity Type"), {content:"selectFilter"}], adjust:"data", collection:activityType, sort:"string",fillspace:true},
				{id:"DueDate",header:[_("Due Date"),{content:"datepickerFilter", inputConfig:{ timepicker:true }}], adjust:"data",format:webix.Date.dateToStr("%d-%m-%Y %H:%i"), sort:"date",fillspace:true},
				{id:"Details",header:[_("Details"),{content:"textFilter"}], adjust:"data", sort:"string",fillspace:true},
				{id:"ContactID",header:[_("Contact"),{content:"selectFilter"}], adjust:"data", collection:contacts,sort:"string",fillspace:true},
				{id:"edit",header:"",template:"{common.editIcon()}"},
				{id:"trash",header:"",template:"{common.trashIcon()}"}
			],
			onClick:{
				"wxi-trash":(e,id)=>{
					webix.confirm({
						title:_("Delete activity"),
						ok:_("Yes"),
						cancel:_("No"),
						text:_("Are you shure you whant to delete activity?"),
						type:"confirm-warning",
						callback:(result)=>{
							if(result === true){
								activities.remove(id);
								this.$$("activityTable").filterByAll();
								return false;
							}
						}
					});
					return false;
				},
				"wxi-pencil":(e,id)=>{
					const obj = activities.getItem(id);
					this.PopupWin.showPopup(obj);
				}
			}
		};
		
		const activityTabBar = {
			view:"tabbar",
			localId:"activityTabBar",
			value:"all",
			options:[
				{id:"all", value:_("All")},
				{id:"complited", value:_("Complited")},
				{id:"overdue", value:_("Overdue")},
				{id:"today", value:_("Today")},                
			],
			on:{
				onChange:()=>{
					this.$$("activityTable").filterByAll();
				}
			}
		};


		const addActivity = {
			view:"button",
			type:"form",
			inputWidth:120,
			height:50,
			value:_("Add activity"),
			align:"right",
			click:()=>{
				this.PopupWin.showPopup();
			}
		};

		return{
			rows:[
				addActivity,
				activityTabBar,
				activityTable
			]
		};
	}
	init(){
		activities.filter();
		this.PopupWin= this.ui(PopupWin);
		this.$$("activityTable").sync(activities);
		this.$$("activityTable").registerFilter(
			(this.$$("activityTabBar")),{
				compare:(value,filter,item)=>{
					if(filter == "complited"){
						return item.State == "Close";
					} else if(filter == "overdue"){
						const date = new Date();
						return item.DueDate < date;
					} else if(filter == "today") {
						const date = new Date();
						const	dateDay = date.getDate();
						const itemDay = item.DueDate.getDate();
						if(dateDay === itemDay){
							return item;
						}
					} else {
						return item;
					}
				},
			},
			{
				getValue:(node)=>{
					return node.getValue();
				}
			},
			{
				setValue:(node, value)=>{
					node.setValue(value);}
			}
		);
	}
}

export default ActivityTable;
