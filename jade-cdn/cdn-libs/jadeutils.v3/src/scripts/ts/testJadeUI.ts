import { JadeUIResource, DefaultIconGroup } from "./resource.js";
import { UIDesktop, UIWindow } from "./UIWindow.js";

export class TestJadeUI {


	static testWindowUI() {
		//
		let desktop00 = document.getElementById(`test-desktop-00`);
		if (desktop00) {
			let desktop: UIDesktop = new UIDesktop(desktop00);
			for (let j = 0; j < 3; j++) {
				let win = new UIWindow(desktop, `test-win-00-${j}`, `test win 00-${j}`);
				win.renderIn();
			}
		}
		//
		let icon01 = JadeUIResource.getDefaultIcon(DefaultIconGroup.ELEC_FACE);
		console.log(icon01.x12);
		let icon02 = JadeUIResource.getDefaultIcon(DefaultIconGroup.ELEC_BUG);
		console.log(icon02.x12);
		//
		let desktop01 = document.getElementById(`test-desktop-01`);
		if (desktop01) {
			let desktop: UIDesktop = new UIDesktop(desktop01, { dockBar: { range: 300, maxScale: 1.8 } });
			let win1 = new UIWindow(desktop, `test-win-01-01`, `test win 01-01`, { icons: JadeUIResource.getDefaultIcon(DefaultIconGroup.ELEC_FACE) });
			win1.renderIn();
			let win2 = new UIWindow(desktop, `test-win-01-02`, `test win 01-02`, { icons: JadeUIResource.getDefaultIcon(DefaultIconGroup.ELEC_BUG) });
			win2.renderIn();
			let win3 = new UIWindow(desktop, `test-win-01-03`, `test win 01-03`, { icons: JadeUIResource.getDefaultIcon(DefaultIconGroup.CAMERA) });
			win3.renderIn();
		}
		//
	}


}
