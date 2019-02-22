import {JetView} from "webix-jet";
import files from "../models/files";

class FilesTable extends JetView{
	config(){
		return {
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
	}
	init(){
		this.$$("filesTable").sync(files);
	}
	urlChange(){
		const id = this.getParam("id");
		files.filter((obj)=>{
			return obj.contactId == id;
		});
	}
}

export default FilesTable;
