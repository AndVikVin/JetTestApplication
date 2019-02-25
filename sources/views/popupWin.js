import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityType} from "../models/activities";
import {contacts} from "../models/contacts";

export class PopupWin extends JetView {
	config(){
		const _ = this.app.getService("locale")._;
		return {
			view:"popup",
			position:"center", height:600, width:700,
			body:{ 
				view:"form",
				localId:"form",
				elements:[
					{type:"header", localId:"formHeader", template:"Add activity"},
					{view:"text", label:_("Details"), height:100, name:"Details", invalidMessage:"Can't be empty"},
					{view:"richselect", label:_("Type"), options:{
						view:"suggest", body:{
							view:"list", 
							data:activityType,
							template:"<span class='#Icon#'></span><span>  #Value#</span>",
						}
					}, name:"TypeID", invalidMessage:"Can't be empty"},
					{view:"richselect", localId:"Contact", label:_("Contact"), options:contacts, name:"ContactID", invalidMessage:"Can't be empty"},
					{
						cols:[
							{view:"datepicker", label:_("Date"), name:"Date", format: webix.Date.dateToStr("%d-%m-%Y"),invalidMessage:"Can't be empty", bottomPadding:20},
							{view:"datepicker", label:_("Time"), type:"time", name:"Time", format:webix.Date.dateToStr("%H:%i"), invalidMessage:"Can't be empty",bottomPadding:20}
						]
					},
					{view:"checkbox", label:_("Complited"), labelWidth:110, name:"State", checkValue:"Close", unCheckValue:"Open"},
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
									if(this.$$("addButton").getValue() == _("Save")){
										const id = newValues.id;
										activities.updateItem(id,newValues);
										this.app.callEvent("filterActivityTable");
									} else {
										activities.add(newValues);
									}
									this.claerAll();
								}
							}},
							{view:"button",label:_("Cancel"), width:100,click:()=>{
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
		const _ = this.app.getService("locale")._;
		if(action){
			const currentContact = contacts.getItem(obj);
			this.$$("Contact").setValue(currentContact);
			this.$$("Contact").disable();
		}
		if(obj){
			if(typeof(obj) === "object"){
				this.$$("formHeader").setHTML("<div>"+_("Edit activity") + "</div>");
				this.$$("addButton").setValue(_("Save"));
				obj.Date = obj.DueDate;
				obj.Time = obj.DueDate;
				this.$$("form").setValues(obj);
			} else {
				this.$$("formHeader").setHTML("<div>"+ _("Add activity") + "</div>");
				this.$$("addButton").setValue(_("Add"));
			}
		} else {
			this.$$("formHeader").setHTML("<div>" + _("Add activity") + "</div>");
			this.$$("addButton").setValue(_("Add"));
		}
		this.getRoot().show();
	}
}

export default PopupWin;
