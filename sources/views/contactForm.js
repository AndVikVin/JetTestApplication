import {JetView} from "webix-jet";
import statuses from "../models/statuses";

class ContactForm extends JetView{
	config(){
		const form = {
			view:"form",
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
								{view:"richselect", label:"Status", options:statuses, name:"StatusID", invalidMessage:"Can't be empty"}
							],
						},
						{
							rows:[
								{}
							]
						}
					]
				}
				


			]
		};
		return{
			rows:[
				form,
				{}
			]
		};
	}
}

export default ContactForm;
