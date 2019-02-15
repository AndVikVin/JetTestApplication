import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityType} from "../models/activities";
import {contactsCollServ} from "../models/contacts";

export class PopupWin extends JetView {
	config(){
		return {
			view:"popup",
			position:"center", height:600, width:700,
			body:{ 
				view:"form",
				localId:"form",
				elements:[
					{type:"header", localId:"formHeader", template:"Add activity"},
					{view:"text", label:"Details", height:100, name:"Details", invalidMessage:"Can't be empty"},
					{view:"richselect", label:"Type", options:activityType, name:"TypeID", invalidMessage:"Can't be empty"},
					{view:"richselect", label:"Contact", options:contactsCollServ, name:"ContactID", invalidMessage:"Can't be empty"},
					{
						cols:[
							{view:"datepicker", label:"Date", name:"Date", format: webix.Date.dateToStr("%d-%m-%Y")},
							{view:"datepicker", label:"Time", type:"time", name:"Time", format:webix.Date.dateToStr("%H:%i")}
						]
					},
					{view:"checkbox", label:"Complited", checkValue:"Open", unCheckValue:"Close"},
					{
						cols:[
							{},
							{view:"button", localId:"addButton", width:100, click:()=>{
								const newValues = this.$$("form").getValues();
								const formatDate = webix.Date.dateToStr("%d-%m-%Y");
								const formateTime = webix.Date.dateToStr("%H:%i");
								const currentDate = formatDate(newValues.Date) + " " + formateTime(newValues.Time);
								newValues.DueDate = currentDate;
								delete newValues.Date;
								delete newValues.Time;
								if(this.$$("form").validate()){
									if(this.$$("addButton").getValue() === "Save"){
										const id = newValues.id;
										activities.updateItem(id,newValues);
									} else {
										activities.add(newValues);
									}
									this.$$("form").clear();
									this.$$("form").clearValidation();
									this.getRoot().hide();
								}
							}},
							{view:"button",label:"Cancel", width:100,click:()=>{
								this.$$("form").clear();
								this.$$("form").clearValidation();
								this.getRoot().hide();
							}
							}
						]
					}
				],
				rules:{
					Details:webix.rules.isNotEmpty,
					TypeID: webix.rules.isNotEmpty,
					ContactID: webix.rules.isNotEmpty,
				}
			}
		};
	}
	showPopup(obj){
		if(obj){
			this.$$("formHeader").setHTML("<div>Edit activity</div>");
			this.$$("addButton").setValue("Save");
			obj.Date = obj.DueDate;
			obj.Time = obj.DueDate;
			this.$$("form").setValues(obj);
		} else {
			this.$$("formHeader").setHTML("<div>Add activity</div>");
			this.$$("addButton").setValue("Add");
		}
		this.getRoot().show();
	}
}

export default PopupWin;
