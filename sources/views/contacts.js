import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import "../styles/myCss.css";

class Contacts extends JetView{
	config(){
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
			label:"Add Contact",
			icon:"fas fa-plus",
			click:()=>{
				const list = this.$$("usersList");
				list.unselectAll();
				this.show("./contactForm");
			}
		};
		return{
			cols:[
				{
					rows:[
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
