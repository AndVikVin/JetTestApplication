import {JetView} from "webix-jet";

class Top extends JetView{
	config(){
		const menu = {
			view:"menu", id:"top:menu",
			name:"menu", 
			css:"app_menu",
			width:180, layout:"y", select:true,
			template:"<span class='webix_icon #icon#'></span> #value# ",
			data:[
				{ value:"Contacts", id:"contacts", icon:"wxi-user" },
				{ value:"Activity", id:"activity",  icon:"wxi-pencil" },
				{ value:"Settings", id:"settings",  icon:"wxi-alert" }				
			],
			on:{
				onAfterSelect:(id)=>{
					this.app.show("/top/" + id);
				}
			}
		};
		const header = {
			view:"template",
			type:"header"
		};
		return {
			rows:[
				header,
				{
					cols:[
						menu,
						{$subview:true}
					]
				}
			]
		};
	}

	urlChange(view,url){
		const menu = view.queryView("menu");
		menu.select(url[1]["page"]);
		const header = view.queryView("template");
		const currentItem = menu.getSelectedItem();
		header.define("template",currentItem["value"]);
		header.refresh();
	}
}

export default Top;
