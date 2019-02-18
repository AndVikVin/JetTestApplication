import {JetView} from "webix-jet";
import {contactsCollServ} from "../models/contacts";
import statuses from "../models/statuses";
import {activityType, activities} from "../models/activities";
import "../styles/myCss.css";
import PopupWin from "./popupWin";
import files from "../models/files";

class ContactInfo extends JetView{ 
	config(){
		const detaileInfo = {
			view:"template",
			localId:"detaileInfo",
			template:"<div class='detName'>#FirstName# #LastName#</div> <div class='imgBlock detInfo'><img class='accPict' src='#Photo#' alt='account image' ></img><br><span id ='status'> #Value#</span></div><div class='detInfo1 detInfo'><span class='fas fa-envelope'> #Email#</span><br> <span class='fab fa-skype'> #Skype#</span><br>  <span class='fas fa-briefcase'> #Company#</span><br> <span class='fas fa-tag'> #Job#</span> </div><div class='detInfo2 detInfo'><span class='fas fa-birthday-cake'> #Birthday#</span><br> <span class='fas fa-map-marker-alt'> #Address#</span></div>"
		};

		const activityTable = {
			view:"datatable",
			localId:"activityTable",
			columns:[
				{id:"State",header:"", template:"{common.checkbox()}", checkValue:"Open", unCheckValue:"Close"},
				{id:"TypeID",header:["Activity Type", {content:"selectFilter"}], adjust:"data", collection:activityType, sort:"string",fillspace:true},
				{id:"DueDate",header:["Due Date",{content:"datepickerFilter", inputConfig:{ timepicker:true }}], adjust:"data",format:webix.Date.dateToStr("%d-%m-%Y %H:%i"), sort:"date",fillspace:true},
				{id:"Details",header:["Details",{content:"textFilter"}], adjust:"data", sort:"string",fillspace:true},
				{id:"edit",header:"",template:"{common.editIcon()}"},
				{id:"trash",header:"",template:"{common.trashIcon()}"}
			],
			onClick:{
				"wxi-trash":function(e,id){
					webix.confirm({
						title:"Delete activity",
						ok:"Yes",
						cancel:"No",
						text:"Are you shure you whant to delete activity?",
						type:"confirm-warning",
						callback:(result)=>{
							if(result === true){
								activities.remove(id);
								return false;
							}
						}
					});
					return false;
				},
				"wxi-pencil":(e,id)=>{
					const obj = activities.getItem(id);
					this.PopupWin.showPopup(obj, "Edit");
				}
			}
		};
		const addActivity = {
			view:"button",
			type:"iconButton",
			label:"Add Activity",
			icon:"fas fa-plus",
			align:"right",
			inputWidth:300,
			click:()=>{
				const id = this.getParentView().$$("usersList").getSelectedId();
				this.PopupWin.showPopup(id,"Add");
			}
		};

		const addFiles = {
			view:"uploader", 
			value:"Uppload file",
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
		

		const filesTable = {
			view:"datatable",
			localId:"filesTable",
			data:files,
			columns:[
				{id:"name",header:["Name", {content:"textFilter"}], adjust:"data", sort:"string",fillspace:true},
				{id:"lastModified",header:["Change date",{content:"datepickerFilter", inputConfig:{ timepicker:true }}], adjust:"data",format:webix.Date.dateToStr("%d-%m-%Y %H:%i"), sort:"date",fillspace:true},
				{id:"size",header:["Size",{content:"textFilter"}], adjust:"data", sort:"int",fillspace:true},
				{id:"trash",header:"",template:"{common.trashIcon()}"}
			],
			onClick:{
				"wxi-trash":(e,id)=>{
					webix.confirm({
						title:"Delete file",
						ok:"Yes",
						cancel:"No",
						text:"Are you shure you whant to delete file?",
						type:"confirm-warning",
						callback:(result)=>{
							if(result === true){
								files.remove(id);
								return false;
							}
						}
					});
					return false;
				}
			}
		};

		const contactActivity = {
			view:"tabview",
			cells:[
				{
					header:"Activities",
					body:{
						rows:[
							activityTable,
							addActivity
						]
					}
				},
				{
					header:"Files",
					body:{
						rows:[
							filesTable,
							addFiles
						]
					}
				}
			]
		};
		return {
			rows:[
				{
					cols:[
						detaileInfo,
						{rows:[
							{cols:
								[
									{view:"button",label:"Delete", type:"iconButton", icon:"far fa-trash-alt", width:140, click:()=>{
										const id = this.getParentView().$$("usersList").getSelectedId();
										const activitiesId = [];
										activities.find((obj)=>{
											if(obj.ContactID == id){
												activitiesId.push(obj.id);
											}
										});
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
													activities.remove(activitiesId);
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
		webix.promise.all([
			contactsCollServ.waitData,
			statuses.waitData
		]).then(()=>{
			this.$$("activityTable").clearAll();
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
				activities.filter((obj)=>{
					return obj.ContactID == id;
				});
				files.filter((obj)=>{
					return obj.contactId == id;
				});
				this.$$("activityTable").parse(activities);
				this.$$("filesTable").parse(files);
			}
		});
	}
}

export default ContactInfo;
