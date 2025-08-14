import { JadeUIResource, DefaultIconGroup } from "./resource.js";
import { JadeWindowUI, UIDesktop, UIObj, UIWindowAdpt } from "./UIWindow.js";

class TestWindow01 extends UIWindowAdpt {

	renderIn(): void {
		let renderWindowBody = (): HTMLDivElement => {
			let windowBody = this.ui.windowBody;
			windowBody.style.overflow = this.cfg.body.overflow;
			windowBody.innerHTML = `
			<p> There are just so many possibilities:</p>
			<ul>
				<li>A Task Manager</li>
				<li>A Notepad</li>
				<li>Or even a File Explorer!</li>
			</ul>

			<div class="sunken-panel" style="height: 120px; width: 240px;">
				<table class="interactive">
					<thead>
						<tr><th>Name</th><th>Version</th><th>Company</th></tr>
					</thead>
					<tbody>
						<tr><td>MySQL ODBC 3.51 Driver</td><td>3.51.11.00</td><td>MySQL AB</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
						<tr><td>SQL Server</td><td>3.70.06.23</td><td>Microsoft Corporation</td></tr>
					</tbody>
				</table>
			</div>
		`;
			return windowBody;
		}

		let renderStatusBar = (): HTMLDivElement => {
			let statusBar = document.createElement("div");
			statusBar.classList.add("status-bar");
			statusBar.innerHTML = `
			<p class="status-bar-field">Press F1 for help</p>
			<p class="status-bar-field">Slide 1</p>
			<p class="status-bar-field">CPU Usage: 14%</p>
		`;
			return statusBar;
		}
		JadeWindowUI.renderWindowTplt(this, renderWindowBody, renderStatusBar);
	}

}

export class TestJadeUI {


	static testWindowUI() {
		//
		let desktop00 = document.getElementById(`test-desktop-00`);
		if (desktop00) {
			let desktop: UIDesktop = new UIDesktop(desktop00);
			for (let j = 0; j < 3; j++) {
				let win = new TestWindow01(desktop, `test-win-00-${j}`, `test win 00-${j}`);
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
			let win1 = new TestWindow01(desktop, `test-win-01-01`, `test win 01-01`, { icons: JadeUIResource.getDefaultIcon(DefaultIconGroup.ELEC_FACE) });
			win1.renderIn();
			let win2 = new TestWindow01(desktop, `test-win-01-02`, `test win 01-02`, { icons: JadeUIResource.getDefaultIcon(DefaultIconGroup.ELEC_BUG) });
			win2.renderIn();
			let win3 = new TestWindow01(desktop, `test-win-01-03`, `test win 01-03`, { icons: JadeUIResource.getDefaultIcon(DefaultIconGroup.CAMERA), scalable: false});
			win3.renderIn();
		}
		//
	}


}
