import {JetView} from "webix-jet";
import statuses from "../models/statuses";
import { contactsCollServ } from "../models/contacts";

class ContactForm extends JetView{
	config(){
		const form = {
			view:"form",
			localId:"contactForm",
			elementsConfig:{
				margin:15,
				labelWidth:150,
				labelAlign:"left"
			},
			elements:[
				{
					cols:[
						{
							rows:[
								{view:"text", label:"First name", name:"FirstName", invalidMessage:"Can't be empty"},
								{view:"text", label:"Last name", name:"LastName", invalidMessage:"Can't be empty"},
								{view:"datepicker", label:"Joining date", name:"StartDate"},
								{view:"richselect", label:"Status", options:statuses, name:"StatusID"},
								{view:"text", label:"Job", name:"Job"},
								{view:"text", label:"Company", name:"Company"},
								{view:"text", label:"Website", name:"Website"},
								{view:"text", label:"Address", name:"Address"},								
							],
						},
						{
							rows:[
								{view:"text", label:"Email", name:"Email"},
								{view:"text", label:"Skype", name:"Skype"},
								{view:"text", label:"Phone", name:"Phone"},
								{view:"datepicker", label:"Birthday", name:"Birthday", format:webix.Date.dateToStr("%d-%m-%Y")},
							]
						}
					],
				},
				{
					cols:[
						{},
						{view:"button", value:"Cancel",width:100, click:()=>{
							const id = this.getParam("id");
							const parentView = this.getParentView();
							if(id){
								this.claerAll(id);
							} else {
								const firstItem = contactsCollServ.getFirstId();
								parentView.show("./ContactInfo?id=" + firstItem);
							}
						}},
						{view:"button",localId:"addButton", value:"Add",width:100, click:()=>{
							const id = this.getParam("id");
							const newValues = this.$$("contactForm").getValues();
							const dateFormatSave =  webix.Date.dateToStr("%d-%m-%Y");
							newValues.Birthday = dateFormatSave(newValues.Birthday);
							if(id){
								if(this.$$("contactForm").validate()){
									contactsCollServ.updateItem(id,newValues);
								}
							} else {
								if(this.$$("contactForm").validate()){
									contactsCollServ.add(newValues);
								}
							}
							this.claerAll(id);
						}},								
					]
				}
			],
			rules:{
				FirstName:webix.rules.isNotEmpty,
				LastName:webix.rules.isNotEmpty			
			}
		};
		return{
			rows:[
				form,
				{}
			]
		};
	}
	claerAll(id){
		this.$$("contactForm").clear();
		this.$$("contactForm").clearValidation();
		const parentView = this.getParentView();
		if(id){
			parentView.show("./ContactInfo?id=" + id);
		} else {
			const lastAdded = contactsCollServ.getLastId();
			parentView.show("./ContactInfo?id=" + lastAdded);
		}
	}
	urlChange(){
		const id = this.getParam("id");
		contactsCollServ.waitData.then(()=>{
			const item = contactsCollServ.getItem(id);
			if(id){
				this.$$("contactForm").setValues(item);
				this.$$("addButton").setValue("Save");
			}
		});
	}
}

export default ContactForm;
