import {JetView} from "webix-jet";
import {contactsCollServ} from "../models/contacts";
import {activities, activityType} from "../models/activities";
import PopupWin from "./popupWin";

class ActivityTable extends JetView{
	config(){
		const activityTable = {
			view:"datatable",
			columns:[
				{id:"State",header:"", template:"{common.checkbox()}", checkValue:"Open", unCheckValue:"Close"},
				{id:"TypeID",header:["Activity Type", {content:"selectFilter"}], adjust:"data", collection:activityType, sort:"string",fillspace:true},
				{id:"DueDate",header:["Due Date",{content:"datepickerFilter"}], adjust:"data",format:webix.Date.dateToStr("%d-%m-%Y %H:%i"), sort:"date",fillspace:true},
				{id:"Details",header:["Details",{content:"textFilter"}], adjust:"data", sort:"string",fillspace:true},
				{id:"ContactID",header:["Contact",{content:"selectFilter"}], adjust:"data", collection:contactsCollServ,sort:"string",fillspace:true},
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
				},
				"wxi-pencil":function(e,id){
					const obj = activities.getItem(id);
					this.$scope.PopupWinEdit.showPopup(obj);
				}
			}
		};
		
		const addActivity = {
			view:"button",
			type:"form",
			inputWidth:120,
			value:"Add activity",
			align:"right",
			click:()=>{
				this.PopupWinAdd.showPopup();
			}
		};

		return{
			rows:[
				addActivity,
				activityTable
			]
		};
	}
	init(view){
		const PopupWinAdd = new PopupWin(this.app,"","Add",contactsCollServ,activityType,"Add");
		const PopupWinEdit = new PopupWin(this.app,"","Edit",contactsCollServ,activityType,"Save");
		this.PopupWinAdd = this.ui(PopupWinAdd);
		this.PopupWinEdit = this.ui(PopupWinEdit);
		activities.waitData.then(()=>{
			view.queryView("datatable").sync(activities);
		});
	}
}

export default ActivityTable;
