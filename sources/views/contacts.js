import {JetView} from "webix-jet";
import ContactInfo from "./ContactInfo";
import {contactsCollServ} from "../models/contacts";
import "../styles/myCss.css";

class Contacts extends JetView{
	config(){
		const usersList = {
			view:"list", select:"true",
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
	urlChange(view){
		contactsCollServ.waitData.then(()=>{
			const list = view.queryView("list");
			let id = this.getParam("id");
	
			id = id || list.getFirstId();
			if(id && list.exists(id))
				list.select(id);
		});
	}
}














// import ContactForm from "./ContactForm";
// // import {contactsColl} from "../models/contacts";
// import {contactsCollServ} from "../models/contacts";
// import "../styles/myCss.css";

// class Contacts extends JetView{
// 	config(){
// 		const _ = this.app.getService("locale")._;
// 		const usersList = {
// 			rows:[
// 				{
// 					view:"list",
// 					select:true, template:"#Name# #Email# <span class='webix_icon wxi-close delBut'></span>",
// 					onClick:{
// 						"wxi-close":function(e,id){
// 							// this.data.remove(id);
// 							contactsCollServ.remove(id);
// 							return false;
// 						}
// 					},
// 					on:{
// 						onAfterSelect:function(id){
// 							this.$scope.setParam("id",id,true);
// 						}
// 					} 
// 				},
// 				{view:"button",value:_("Add"), type:"form", inputWidth:180, align:"right", /*click:()=>{
// 					contactsColl.add({Name: "name", Email:"email"});
// 				},*/click:()=>{contactsCollServ.add({Name: "name", Email:"email"});}}
// 			]
// 		};
// 		return {
// 			cols:[
// 				usersList,
// 				ContactForm
// 			]
			
// 		};
// 	}
// 	init(view){
// 		// view.queryView("list").parse(contactsColl);
// 		view.queryView("list").parse(contactsCollServ);
		
// 	}
// 	urlChange(view){
// 		contactsCollServ.waitData.then(()=>{
// 			const list = view.queryView("list");
// 			let id = this.getParam("id");
	
// 			id = id || list.getFirstId();
// 			if(id && list.exists(id))
// 				list.select(id);
// 		});
// 	// 	const list = view.queryView("list");
// 	// 	let id = this.getParam("id");

// 	// 	id = id || list.getFirstId();
// 	// 	if(id && list.exists(id))
// 	// 		list.select(id);
// 	}
// }

export default Contacts;
