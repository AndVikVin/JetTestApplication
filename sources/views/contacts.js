import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import statuses from "../models/statuses";
import "../styles/myCss.css";

class Contacts extends JetView{
	config(){
		const _ = this.app.getService("locale")._;
		const usersList = {
			view:"list", localId:"usersList", select:"true",
			maxWidth:350,
			type:{
				height:70
			},
			template:"<span class='far fa-user-circle fa-4x'></span>  <span class='contact'>#FirstName# #LastName#<br>#Company#</span>",	
			on:{
				onAfterSelect:(id)=>{
					this.show("./ContactInfo?id=" + id);
				}
			}
		};
		const addButton = {
			view:"button",
			type:"iconButton",
			label:_("Add Contact"),
			icon:"fas fa-plus",
			click:()=>{
				const list = this.$$("usersList");
				list.unselectAll();
				this.show("./contactForm");
			}
		};
		const filterContact  = {
			view:"text",
			keyPressTimeout:1000,
			on: {
				onTimedKeyPress:function(){
					let value = this.getValue().toLowerCase();
					const searchParams = ["value", "Company", "Job", "Email", "Skype", "Website", "Address","Status"];
					contacts.filter((obj)=>{
						for (let i = 0; i < searchParams.length; i++){
							if(searchParams[i] === "Status"){
								if(obj.StatusID){
									const status = statuses.getItem(obj.StatusID);
									obj.Status = status.Value;
									if(obj[searchParams[i]].toLowerCase().indexOf(value)!=-1){
										return obj;
									}
								}
							} else {
								if(obj[searchParams[i]].toLowerCase().indexOf(value)!=-1){	
									return obj;
								}
							}
						}
					});
					const list = this.$scope.$$("usersList");
					const first = list.getFirstId();
					list.unselectAll();
					list.select(first);
				}
			}
		};
		return{
			cols:[
				{
					rows:[
						filterContact,
						usersList,
						addButton
					]
				},
				{$subview:true}
			]
		
		};
	}
	init(){
		const list = this.$$("usersList");
		this.on(this.app,"showContactForm",()=>{
			const id = list.getSelectedId();
			this.show("./contactForm?id=" + id);
		});
		this.on(this.app,"showContact",()=>{
			const id = list.getSelectedId();
			this.show("./ContactInfo?id=" + id);
		});
		this.on(this.app,"showFirstContact",()=>{
			const id = list.getFirstId();
			list.select(id);
		});
		this.on(webix.dp(contacts),"onAfterInsert",(response)=>{
			list.select(response.id);
		});
		list.sync(contacts);
		contacts.waitData.then(()=>{
			list.select(list.getFirstId());
		});
	}
}

export default Contacts;
