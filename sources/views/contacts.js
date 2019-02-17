import {JetView} from "webix-jet";
import {contactsCollServ} from "../models/contacts";
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
					const currentSubview = this.getSubView();
					const page = currentSubview.getUrl()[0].page;
					if(page === "ContactInfo"){
						currentSubview.setParam("id",id,true);
					} else {
						this.show("./ContactInfo?id=" + id);
					}
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
		list.parse(contactsCollServ);
		contactsCollServ.waitData.then(()=>{
			console.log(list.data.pull)
			this.show("./ContactInfo?id=" + list.getFirstId());
			list.select(list.getFirstId());
		});
	}
}

export default Contacts;
