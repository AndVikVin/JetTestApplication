import {JetView, plugins} from "webix-jet";


class Top extends JetView{
	config(){
		const _ = this.app.getService("locale")._;
		const menu = {
			view:"menu", id:"top:menu",
			name:"menu", 
			localId:"topMenu",
			css:"app_menu",
			width:180, layout:"y", select:true,
			template:"<span class='webix_icon #icon#'></span> #value# ",
			data:[
				{ value:_("Contacts"), id:"contacts", icon:"wxi-user" },
				{ value:_("Activities"), id:"activity",  icon:"wxi-pencil" },
				{ value:_("Settings"), id:"settings",  icon:"wxi-alert" }				
			],
			on:{
				onAfterSelect:()=>{
					const currentItem = this.$$("topMenu").getSelectedItem();
					this.$$("header").setHTML("<div>" + currentItem["value"] + "</div>");
				}
			}
		};
		const header = {
			view:"template",
			type:"header",
			localId:"header"
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
	init(){
		this.use(plugins.Menu, "top:menu");
	}
}

export default Top;
