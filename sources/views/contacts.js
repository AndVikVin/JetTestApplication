import {JetView} from "webix-jet";
import ContactInfo from "./ContactInfo";
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
				onAfterSelect:function(id){
					this.$scope.setParam("id",id,true);
				}
			}
		};
		return{
			cols:[
				usersList,
				ContactInfo
			]
		
		};
	}
	init(view){
		view.queryView("list").parse(contactsCollServ);
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
