
import {JetView} from "webix-jet";
import {contactsCollServ} from "../models/contacts";
import statuses from "../models/statuses";
import "../styles/myCss.css";

class ContactInfo extends JetView{ 
	config(){
		const detaileInfo = {
			view:"template",
			localId:"detaileInfo",
			template:"<div class='detName'>#FirstName# #LastName#</div> <div class='imgBlock detInfo'><img src='#Photo#' alt='account image' ></img><br><span id ='status'> #Value#</span></div><div class='detInfo1 detInfo'><span class='fas fa-envelope'> #Email#</span><br> <span class='fab fa-skype'> #Skype#</span><br>  <span class='fas fa-briefcase'> #Company#</span><br> <span class='fas fa-tag'> #Job#</span> </div><div class='detInfo2 detInfo'><span class='fas fa-birthday-cake'> #Birthday#</span><br> <span class='fas fa-map-marker-alt'> #Address#</span></div>"
		};
		const contactActivity = {
			view:"tabview",
			
		}
		return {
			cols:[
				detaileInfo,
				{rows:[
					{cols:
						[
							{view:"button",label:"Delete", type:"iconButton", icon:"far fa-trash-alt", width:140, click:()=>{
								const id = this.getParentView().$$("usersList").getSelectedId();
								webix.confirm({
									title:"Delete Contact",
									ok:"Yes",
									cancel:"No",
									text:"Are you shure you whant to delete this contact?",
									type:"confirm-warning",
									callback:(result)=>{
										if(result === true){
											const firstItem = contactsCollServ.getFirstId();
											contactsCollServ.remove(id);
											this.getParentView().show("./ContactInfo?id=" + firstItem);
											return false;
										}
									}
								});
							
							}},
							{view:"button",label:"Edit", type:"iconButton", icon:"far fa-edit", width:140, click:()=>{
								const id = this.getParentView().$$("usersList").getSelectedId();
								this.getParentView().show("./contactForm?id=" + id);
							}},
						]
					},
					{}
				]}
			]
		};
	}
	urlChange(){
		webix.promise.all([
			contactsCollServ.waitData,
			statuses.waitData
		]).then(()=>{
			const id = this.getParam("id");
			if(id && contactsCollServ.exists(id)){
				this.getParentView().$$("usersList").select(id);
				const currentItem = webix.copy(contactsCollServ.getItem(id));
				if(currentItem.StatusID){
					currentItem.Value = statuses.getItem(currentItem.StatusID).Value;
				} else {
					currentItem.Value = "Not specified";
				}
				this.$$("detaileInfo").parse(currentItem);
			}
		});
	}
}

export default ContactInfo;
