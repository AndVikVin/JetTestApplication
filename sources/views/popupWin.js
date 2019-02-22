import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityType} from "../models/activities";
import {contacts} from "../models/contacts";

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
					{view:"richselect", localId:"Contact", label:"Contact", options:contacts, name:"ContactID", invalidMessage:"Can't be empty"},
					{
						cols:[
							{view:"datepicker", label:"Date", name:"Date", bottomPadding:20, format: webix.Date.dateToStr("%d-%m-%Y"),invalidMessage:"Can't be empty"},
							{view:"datepicker", label:"Time", type:"time", bottomPadding:20, name:"Time", format:webix.Date.dateToStr("%H:%i"), invalidMessage:"Can't be empty"}
						]
					},
					{view:"checkbox", label:"Complited", name:"State", checkValue:"Open", unCheckValue:"Close"},
					{
						cols:[
							{},
							{view:"button", localId:"addButton", width:100, click:()=>{
								const newValues = this.$$("form").getValues();
								if(newValues.Date & newValues.Time){
									newValues.Date.setHours(newValues.Time.getHours(),newValues.Time.getMinutes());
									newValues.DueDate = newValues.Date;
									delete newValues.Date;
									delete newValues.Time;
								}
								if(this.$$("form").validate()){
									if(this.$$("addButton").getValue() === "Save"){
										const id = newValues.id;
										activities.updateItem(id,newValues);
									} else {
										activities.add(newValues);
									}
									this.claerAll();
								}
							}},
							{view:"button",label:"Cancel", width:100,click:()=>{
								this.claerAll();
							}
							}
						]
					}
				],
				rules:{
					Details:webix.rules.isNotEmpty,
					TypeID: webix.rules.isNotEmpty,
					ContactID: webix.rules.isNotEmpty,
					Date: webix.rules.isNotEmpty,
					Time:	webix.rules.isNotEmpty	
				}
			}
		};
	}
	claerAll(){
		this.$$("form").clear();
		this.$$("form").clearValidation();
		this.getRoot().hide();
	}
	showPopup(obj,action){
		if(action){
			const currentContact = contacts.getItem(obj);
			this.$$("Contact").setValue(currentContact);
			this.$$("Contact").disable();
		}
		if(obj){
			if(typeof(obj) === "object"){
				this.$$("formHeader").setHTML("<div>Edit activity</div>");
				this.$$("addButton").setValue("Save");
				obj.Date = obj.DueDate;
				obj.Time = obj.DueDate;
				this.$$("form").setValues(obj);
			} else {
				this.$$("formHeader").setHTML("<div>Add activity</div>");
				this.$$("addButton").setValue("Add");
			}
		} else {
			this.$$("formHeader").setHTML("<div>Add activity</div>");
			this.$$("addButton").setValue("Add");
		}
		this.getRoot().show();
	}
}

export default PopupWin;
