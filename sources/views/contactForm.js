import {JetView} from "webix-jet";
import statuses from "../models/statuses";
import { contacts } from "../models/contacts";

class ContactForm extends JetView{
	config(){
		const _ = this.app.getService("locale")._;
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
								{view:"text", label:_("First name"), name:"FirstName", invalidMessage:_("Can't be empty")},
								{view:"text", label:_("Last name"), name:"LastName", invalidMessage:_("Can't be empty")},
								{view:"datepicker", label:_("Joining date"), name:"StartDate"},
								{view:"richselect", label:_("Status"), options:statuses, name:"StatusID"},
								{view:"text", label:_("Job"), name:"Job"},
								{view:"text", label:_("Company"), name:"Company"},
								{view:"text", label:_("Website"), name:"Website"},
								{view:"text", label:_("Address"), name:"Address"},								
							],
						},
						{
							rows:[
								{view:"text", label:"Email", name:"Email"},
								{view:"text", label:"Skype", name:"Skype"},
								{view:"text", label:_("Phone"), name:"Phone"},
								{view:"datepicker", label:_("Birthday"), name:"Birthday", format:webix.Date.dateToStr("%d-%m-%Y")},
								{
									cols:[
										{
											view:"template",
											localId:"accPict",
											name:"Photo",
											template:"<img class='accPict fas fa-user fa-10x' src='#src#'></img>",
										},
										{
											rows:[
												{},
												{ 
													view:"uploader", 
													value:_("Change photo"),
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
												{view:"button", value:_("Delete photo"), click:()=>{
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
						{view:"button", value:_("Cancel"),width:100, click:()=>{
							const id = this.getParam("id");
							if(id){
								this.claerAll(id);
							} else {
								this.app.callEvent("showFirstContact");
							}
						}},
						{view:"button",localId:"addButton", value:_("Add"),width:100, click:()=>{
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
		const _ = this.app.getService("locale")._;
		const id = this.getParam("id");
		contacts.waitData.then(()=>{
			const item = contacts.getItem(id);
			if(id){
				this.$$("accPict").setValues({src:item.Photo});
				this.$$("contactForm").setValues(item);
				this.$$("addButton").setValue(_("Save"));
			} else {
				this.$$("contactForm").clear();
				this.$$("accPict").setValues({src:""});
			}
		});
	}
}

export default ContactForm;
