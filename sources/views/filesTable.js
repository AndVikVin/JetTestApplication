import {JetView} from "webix-jet";
import files from "../models/files";

class FilesTable extends JetView{
	config(){
		const _ = this.app.getService("locale")._;
		return {
			view:"datatable",
			localId:"filesTable",
			data:files,
			columns:[
				{id:"name",header:[_("Name"), {content:"textFilter"}], adjust:"data", sort:"string",fillspace:true},
				{id:"lastModified",header:[_("Change date"),{content:"datepickerFilter", inputConfig:{ timepicker:true }}], adjust:"data",format:webix.Date.dateToStr("%d-%m-%Y %H:%i"), sort:"date",fillspace:true},
				{id:"size",header:[_("Size"),{content:"textFilter"}], adjust:"data", sort:"int",fillspace:true},
				{id:"trash",header:"",template:"{common.trashIcon()}"}
			],
			onClick:{
				"wxi-trash":(e,id)=>{
					webix.confirm({
						title:_("Delete file"),
						ok:_("Yes"),
						cancel:_("No"),
						text:_("Are you shure you whant to delete file?"),
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
