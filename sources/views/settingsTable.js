import {JetView} from "webix-jet";

export default class SettingsTable extends JetView{
	constructor(app,name,data, header, icons){
		super(app,name);
		this._contactData = data;
		this._header = header;
		this._icons = icons;
	}
	config(){
		const _ = this.app.getService("locale")._;
		const addButton = {
			view:"button",
			localId:"addButton",
			label:_("Add") +" "+ this._header,
			click:()=>{
				this._contactData.add({Value:"", Icon:""},0);
				webix.dp(this._contactData).attachEvent("onAfterInsert", (response)=>{ 
					const lastAdded = response.id;
					this.$$("iconTable").editRow(lastAdded);
				});
			}
		};
		return {
			rows:[
				addButton,
				{
					view:"datatable",
					localId:"iconTable",
					editable:true,
					editaction:"click",
					header:this._header,
					columns:[
						{id:"Value", header:this._header,editor:"text",fillspace:true },
						{id:"Icon", header:_("Icon"), template:"<span class='#Icon#'></span>", editor:"richselect",options:this._icons},
						{id:"trash",header:"",template:"{common.trashIcon()}"}
					],
					onClick:{
						"wxi-trash":(e,id)=>{
							webix.confirm({
								title:_("Delete") + " " + this._header,
								ok:_("Yes"),
								cancel:_("No"),
								text:_("Are you shure you whant to delete") + " " + this._header,
								type:"confirm-warning",
								callback:(result)=>{
									if(result === true){
										this._contactData.remove(id);
										return false;
									}
								}
							});
							return false;
						}
					},
				}
			]
		};
	}
	init(){
		this.$$("iconTable").sync(this._contactData);
		// this.$$("iconTable").parse(this._contactData);
	}
}

