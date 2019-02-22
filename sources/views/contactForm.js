import {JetView} from "webix-jet";
import statuses from "../models/statuses";
import { contacts } from "../models/contacts";

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
								{
									cols:[
										{
											view:"template",
											localId:"accPict",
											name:"Photo",
											template:"<img class='accPict' src='#src#'></img>",
										},
										{
											rows:[
												{},
												{ 
													view:"uploader", 
													value:"Change photo",
													localId:"photoUploader",
													accept:"image/jpeg, image/png",
													autosend:false, 
													multiple:false,
													on:{        
														onBeforeFileAdd: (upload)=>{      
															const file = upload.file;
															const reader = new FileReader();  
															reader.onload = (event)=>{
																this.$$("accPict").setValues({src:event.target.result});
																this.$$("contactForm").setValues({Photo:event.target.result}, true);
															};           
															reader.readAsDataURL(file);
															return false;
														}
													}
												},
												{view:"button", value:"Delete photo", click:()=>{
													this.$$("accPict").setValues({src:""});
													this.$$("contactForm").setValues({Photo:""}, true);
												}}
											]
										}
									]
								}
							]
						}
					],
				},
				{
					cols:[
						{},
						{view:"button", value:"Cancel",width:100, click:()=>{
							const id = this.getParam("id");
							if(id){
								this.claerAll(id);
							} else {
								this.app.callEvent("showFirstContact");
							}
						}},
						{view:"button",localId:"addButton", value:"Add",width:100, click:()=>{
							const id = this.getParam("id");
							const newValues = this.$$("contactForm").getValues();
							const dateFormatSave =  webix.Date.dateToStr("%d-%m-%Y");
							newValues.Birthday = dateFormatSave(newValues.Birthday);
							if(this.$$("contactForm").validate()){
								if(id){
									contacts.updateItem(id,newValues);
								} else {
									contacts.add(newValues);
								}
								this.claerAll(id);
							}
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
		if(id){
			this.app.callEvent("showContact");
		}
	}

	urlChange(){
		const id = this.getParam("id");
		contacts.waitData.then(()=>{
			const item = contacts.getItem(id);
			if(id){
				this.$$("accPict").setValues({src:item.Photo});
				this.$$("contactForm").setValues(item);
				this.$$("addButton").setValue("Save");
			} else {
				this.$$("contactForm").clear();
				this.$$("accPict").setValues({src:""});
			}
		});
	}
}

export default ContactForm;
