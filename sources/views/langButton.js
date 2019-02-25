import {JetView} from "webix-jet";

class LangButton extends JetView{
	config(){
		const _ = this.app.getService("locale")._;
		const langs = this.app.getService("locale");
		return{
			view:"segmented", id:"langButton", value:langs.getLang(),
			multiview:true,
			options:[
				{id:"en", value:_("English")},
				{id:"ru", value:_("Russian")},				
			],
			click:() => this.toggleLanguage()
		};
	}
	toggleLanguage(){
		const langs = this.app.getService("locale");
		const value = this.getRoot().getValue();
		langs.setLang(value);
	}
}

export default LangButton;
