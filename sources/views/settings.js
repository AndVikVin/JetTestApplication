import {JetView} from "webix-jet";
import LangButton from "./langButton";
import SettingsTable from "./settingsTable";
import activityIcons from "../models/actyvityIcons";
import statusIcons from "../models/statusIcons";
import {activityType} from "../models/activities";
import statuses from "../models/statuses";

class Settings extends JetView{
	config(){
		const _ = this.app.getService("locale")._;
		return {
			rows:[
				LangButton,
				{cols:[
					new SettingsTable(this.app,"",activityType,_("activity type"),activityIcons),
					new SettingsTable(this.app,"",statuses,_("status"),statusIcons),
				]},
			]
		};
	}
}

export default Settings;
