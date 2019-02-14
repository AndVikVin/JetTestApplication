import {JetView} from "webix-jet";
import {activities} from "../models/activities";

export class PopupWin extends JetView {
	constructor(app,name,buttonValue, contacts, typeActivity, action){
		super(app,name);
		this._buttonValue = buttonValue;
		this._contacts = contacts;
		this._typeActivity = typeActivity;
		this._action = action;
	}
	config(){
		return {
			view:"popup",
			position:"center", height:600, width:700,
			body:{ 
				view:"form",
				localId:"form",
				elements:[
					{type:"header",template:this._buttonValue + " " + "activity"},
					{view:"text", label:"Details", height:100, name:"Details", invalidMessage:"Can't be empty"},
					{view:"richselect", label:"Type", options:this._typeActivity, name:"TypeID", invalidMessage:"Can't be empty"},
					{view:"richselect", label:"Contact", options:this._contacts, name:"ContactID", invalidMessage:"Can't be empty"},
					{
						cols:[
							{view:"datepicker", label:"Date", name:"Date"},
							{view:"datepicker", label:"Time", type:"time", name:"Time"}
						]
					},
					{view:"checkbox", label:"Complited", name:"State"},
					{
						cols:[
							{},
							{view:"button",label:this._action, width:100, click:()=>{
								const newValues = this.$$("form").getValues();
								const formatDate = webix.Date.dateToStr("%d-%m-%Y");
								const formateTime = webix.Date.dateToStr("%H:%i");
								const currentDate = formatDate(newValues.Date) + " " + formateTime(newValues.Time);
								newValues.DueDate = currentDate;
								if(this.$$("form").validate()){
									if(this._action === "Save"){
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
			obj.Date = obj.DueDate;
			obj.Time = obj.DueDate;
			this.$$("form").setValues(obj);
		}
		this.getRoot().show();
	}
}

export default PopupWin;
