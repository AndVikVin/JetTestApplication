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
		return{
			cols:[
				usersList,
				{$subview:true}
			]
		
		};
	}
	init(view){
		view.queryView("list").parse(contactsCollServ);
		const list = view.queryView("list");
		contactsCollServ.waitData.then(()=>{
			this.show("./ContactInfo?id=" + list.getFirstId());
			list.select(list.getFirstId());
		});
	}
	urlChange(){
		contactsCollServ.waitData.then(()=>{
			const list = this.$$("usersList");
			let id = this.getParam("id");
	
			id = id || list.getFirstId();
			if(id && list.exists(id))
				list.select(id);
		});
	}
}

export default Contacts;
