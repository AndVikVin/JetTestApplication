import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import statuses from "../models/statuses";
import {activities} from "../models/activities";
import ActivityTable from "./activityTable";
import FilesTable from "./filesTable";
import "../styles/myCss.css";
import PopupWin from "./popupWin";
import files from "../models/files";

class ContactInfo extends JetView{ 
	config(){
		const _ = this.app.getService("locale")._;
		const detaileInfo = {
			view:"template",
			localId:"detaileInfo",
			template:"<div class='detName'>#FirstName# #LastName#</div> <div class='imgBlock detInfo'><img class='accPict fas fa-user fa-10x' src='#Photo#'></img><br><span id ='status'> #Value#</span></div><div class='detInfo1 detInfo'><span class='fas fa-envelope'> #Email#</span><br> <span class='fab fa-skype'> #Skype#</span><br>  <span class='fas fa-briefcase'> #Company#</span><br> <span class='fas fa-tag'> #Job#</span> </div><div class='detInfo2 detInfo'><span class='fas fa-birthday-cake'> #Birthday#</span><br> <span class='fas fa-map-marker-alt'> #Address#</span></div>"
		};

		const addActivity = {
			view:"button",
			type:"iconButton",
			label:_("Add activity"),
			icon:"fas fa-plus",
			align:"right",
			inputWidth:300,
			click:()=>{
				const id = this.getParam("id");
				this.PopupWin.showPopup(id,"Add");
			}
		};

		const addFiles = {
			view:"uploader", 
			value:_("Uppload file"),
			localId:"fileUploader",
			inputWidth:250,
			align:"center",
			autosend:false, 
			multiple:false,
			on:{        
				onBeforeFileAdd: (upload)=>{      
					const file = upload.file;
					const id = this.getParam("id");
					files.add({
						id: upload.id,
						contactId:id,
						name: file.name,
						size: file.size,
						lastModified:file.lastModifiedDate
					});
					return false;
				}
			}
		};
		const contactActivity = {
			view:"tabview",
			cells:[
				{
					header:_("Activities"),
					body:{
						rows:[
							ActivityTable,
							addActivity
						]
					}
				},
				{
					header:_("Files"),
					body:{
						rows:[
							FilesTable,
							addFiles
						]
					}
				}
			]
		};

		const deleteButton = {
			view:"button",label:_("Delete"), type:"iconButton", icon:"far fa-trash-alt", width:140, click:()=>{
				const id = this.getParam("id");
				const activitiesId = [];
				activities.find((obj)=>{
					if(obj.ContactID == id){
						activitiesId.push(obj.id);
					}
				});
				webix.confirm({
					title:_("Delete Contact"),
					ok:_("Yes"),
					cancel:_("No"),
					text:_("Are you shure you whant to delete this contact?"),
					type:"confirm-warning",
					callback:(result)=>{
						if(result === true){
							contacts.remove(id);
							activities.remove(activitiesId);
							this.app.callEvent("showFirstContact");
							return false;
						}
					}
				});
			}};
		const editButton = {
			view:"button",label:_("Edit"), type:"iconButton", height:50, icon:"far fa-edit", width:140, click:()=>{
				this.app.callEvent("showContactForm");
			}};
		return {
			rows:[
				{
					cols:[
						detaileInfo,
						{rows:[
							{cols:
								[
									deleteButton,
									editButton
								]
							},
							{}
						]}
					]
				},
				contactActivity
			]
		};
	}
	init(){
		this.PopupWin= this.ui(PopupWin);
		files.filter();

	}
	urlChange(){
		const _ = this.app.getService("locale")._;
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(()=>{
			const id = this.getParam("id");
			if(id && contacts.exists(id)){
				const currentItem = webix.copy(contacts.getItem(id));
				if(currentItem.StatusID){
					currentItem.Value = statuses.getItem(currentItem.StatusID).Value;
					currentItem.Value = _(currentItem.Value);
				} else {
					currentItem.Value = _("Not specified");
				}
				this.$$("detaileInfo").parse(currentItem);
			}
		});
	}
}

export default ContactInfo;
