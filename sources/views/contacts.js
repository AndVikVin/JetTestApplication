import {JetView} from "webix-jet";
import {contactsCollServ} from "../models/contacts";
import statuses from "../models/statuses";
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
		const filterContact  = {
			view:"text",
			keyPressTimeout:1000,
			on: {
				onTimedKeyPress:function(){
					let value = this.getValue().toLowerCase();
					const searchParams = ["value", "Company", "Job", "Email", "Skype", "Website", "Address","Status"];
					contactsCollServ.filter((obj)=>{
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
		list.parse(contactsCollServ);
		contactsCollServ.waitData.then(()=>{
			this.show("./ContactInfo?id=" + list.getFirstId());
			list.select(list.getFirstId());
		});
	}
}

export default Contacts;
